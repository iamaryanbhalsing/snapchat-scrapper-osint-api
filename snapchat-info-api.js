var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function j(data, status) {
  return new Response(JSON.stringify(data, null, 2), {
    status: status || 200,
    headers: Object.assign({ "Content-Type": "application/json" }, CORS_HEADERS),
  });
}

function safeStr(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return null;
}

function safeNum(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    var n = Number(v);
    return isNaN(n) ? null : n;
  }
  return null;
}

function safeBool(v) {
  if (v === true || v === false) return v;
  if (typeof v === "string") return v === "true" || v === "1";
  if (typeof v === "number") return v === 1;
  return null;
}

function extractNextData(html) {
  var match = html.match(/id="__NEXT_DATA__"[^>]*>({.+?})<\/script>/);
  if (!match) {
    match = html.match(/id="__NEXT_DATA__"[\s\S]*?>({[\s\S]*?})<\/script>/);
  }
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch (e) { return null; }
}

function parseSubCount(raw) {
  if (!raw) return null;
  var n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

function buildDescription(meta, profile) {
  if (meta && meta.pageDescription && meta.pageDescription.value) {
    return meta.pageDescription.value;
  }
  return null;
}

async function handleRequest(request) {
  var url = new URL(request.url);
  var path = url.pathname;

  if (request.method === "OPTIONS") {
    return new Response("", { status: 204, headers: CORS_HEADERS });
  }

  if (path === "/" || path === "") {
    return j({
      service: "Snapchat Profile Scraper v1.0",
      note: "Zero config. Copy, Paste, Deploy.",
      endpoints: {
        "/info?user=<username>": "Full public profile info",
      },
    });
  }

  if (path === "/info") {
    var userName = url.searchParams.get("user");

    if (!userName) {
      return j({ error: "missing_user", message: "Provide ?user=<username> (e.g., ?user=priyapanchal272)" }, 400);
    }

    userName = userName.trim().replace(/^@/, "").replace(/^\//, "");

    var profileUrl = "https://www.snapchat.com/add/" + encodeURIComponent(userName);

    try {
      var resp = await fetch(profileUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept": "text/html,application/xhtml+xml",
        },
      });

      var html = await resp.text();
      var nextData = extractNextData(html);

      if (!nextData) {
        return j({ error: "parse_failed", message: "Could not extract profile data from Snapchat." }, 422);
      }

      var props = nextData.props || {};
      var pageProps = props.pageProps || {};
      var userProfile = pageProps.userProfile || {};
      var meta = pageProps.pageMetadata || {};
      var linkPreview = pageProps.linkPreview || {};

      var profile = null;
      var exists = false;

      if (userProfile.$case === "publicProfileInfo" && userProfile.publicProfileInfo) {
        exists = true;
        var p = userProfile.publicProfileInfo;

        var previewUrl = null;
        if (linkPreview.twitterImage && linkPreview.twitterImage.url) {
          previewUrl = linkPreview.twitterImage.url;
        } else if (linkPreview.facebookImage && linkPreview.facebookImage.url) {
          previewUrl = linkPreview.facebookImage.url;
        }

        var hasStory = safeBool(p.hasStory);
        if (hasStory === null && pageProps.story) hasStory = true;

        profile = {
          username: p.username || userName,
          display_name: p.title || null,
          description: buildDescription(meta, p),
          exists: true,
          subscriber_count: parseSubCount(p.subscriberCount),
          subscriber_count_display: formatSubDisplay(p.subscriberCount),
          bio: p.bio || null,
          website_url: p.websiteUrl || null,
          address: p.address || null,
          is_verified: p.badge === 1,
          badge: p.badge || 0,
          has_stories: hasStory,
          has_curated_highlights: safeBool(p.hasCuratedHighlights),
          has_spotlight_highlights: safeBool(p.hasSpotlightHighlights),
          profile_picture_url: p.profilePictureUrl || null,
          cover_image_url: p.squareHeroImageUrl || null,
          preview_image_url: previewUrl,
          snapcode_url: p.snapcodeImageUrl || null,
          profile_url: profileUrl,
          profile_completeness_score: computeCompleteness(p),
          category: p.categoryStringId || null,
          subcategory: p.subcategoryStringId || null,
          mutable_name: p.mutableName || null,
          publisher_type: p.publisherType || null,
          creation_timestamp: safeNum(p.creationTimestampMs),
          last_update_timestamp: safeNum(p.lastUpdateTimestampMs),
        };
      } else if (userProfile.$case === "userInfo" && userProfile.userInfo) {
        exists = true;
        var u = userProfile.userInfo;
        profile = {
          username: u.username || userName,
          display_name: u.displayName || null,
          exists: true,
          is_verified: false,
          has_stories: false,
          profile_url: profileUrl,
          snapcode_url: u.snapcodeImageUrl || null,
          preview_image_url: linkPreview.twitterImage ? linkPreview.twitterImage.url : null,
        };
      }

      if (!exists) {
        return j({
          error: "not_found",
          message: "Snapchat user not found or profile data unavailable.",
          username: userName,
        }, 404);
      }

      return j({
        success: true,
        data: profile,
        fetched_at: new Date().toISOString(),
      });

    } catch (e) {
      return j({ error: "fetch_failed", message: e.message }, 500);
    }
  }

  return j({ error: "not_found", message: "Use /info?user=<username>" }, 404);
}

function computeCompleteness(p) {
  var score = 0;
  if (p.title) score += 15;
  if (p.bio) score += 15;
  if (p.profilePictureUrl) score += 15;
  if (p.squareHeroImageUrl) score += 10;
  if (p.address) score += 10;
  if (p.websiteUrl) score += 10;
  if (p.subscriberCount && parseInt(p.subscriberCount, 10) > 0) score += 10;
  if (p.badge > 0) score += 5;
  if (p.hasCuratedHighlights || p.hasSpotlightHighlights) score += 5;
  if (p.categoryStringId) score += 5;
  return Math.min(score, 100);
}

function formatSubDisplay(raw) {
  if (!raw) return null;
  var n = parseInt(raw, 10);
  if (isNaN(n)) return null;
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  return String(n);
}

addEventListener("fetch", function(event) {
  event.respondWith(handleRequest(event.request));
});
