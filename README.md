# Snapchat Profile Scraper

A lightweight, zero-config **Cloudflare Worker** that scrapes public Snapchat profile information.

<div align="center">
  <img src="https://raw.githubusercontent.com/innng/innng/master/assets/kyubey.gif" height="40">
</div>

> **Note**: This tool only accesses publicly available data from Snapchat's web pages.

> **LIVE AT**: https://snapchatinfo.iamaryanbhalsing.workers.dev/info?user=samrudhigagr

>**Just Repalce Username After Equals to sign**
---

## Features

- ✅ Fast & lightweight (Cloudflare Edge)
- ✅ Returns rich profile data (bio, subscriber count, verification, stories, etc.)
- ✅ Handles both public profiles and basic user info
- ✅ CORS enabled (works with frontend apps)
- ✅ Clean JSON responses with proper error handling
- ✅ No API keys or authentication required

---

## Endpoints

### GET `/info?user=<username>`

---

## Deployment (Cloudflare Workers)

1. _Quick Deploy_
```
Go to Cloudflare Workers
Create a new Worker
Paste the entire code from worker.js
Click Save and Deploy
```

2. _Using Wrangler (CLI)_
```
# Clone or create the project
mkdir snapchat-scraper
cd snapchat-scraper
npx wrangler init

# Replace the generated worker with the provided code
cp worker.js src/index.js   # or paste directly

# Deploy
npx wrangler deploy
```

---

### Response Fields

| Field                          | Type      | Description |
|--------------------------------|-----------|-------------|
| `username`                     | `string`  | Snapchat username |
| `display_name`                 | `string`  | User's display name |
| `bio`                          | `string`  | Profile biography |
| `description`                  | `string`  | Meta page description |
| `subscriber_count`             | `number`  | Raw number of subscribers |
| `subscriber_count_display`     | `string`  | Formatted subscriber count (e.g. `1.2M`, `450k`) |
| `is_verified`                  | `boolean` | Whether the account is verified |
| `has_stories`                  | `boolean` | Has active stories |
| `has_curated_highlights`       | `boolean` | Has curated highlights |
| `has_spotlight_highlights`     | `boolean` | Has Spotlight highlights |
| `profile_picture_url`          | `string`  | Profile picture URL |
| `cover_image_url`              | `string`  | Cover / hero image URL |
| `snapcode_url`                 | `string`  | Snapcode image URL |
| `preview_image_url`            | `string`  | Social media preview image |
| `website_url`                  | `string`  | Linked website URL |
| `address`                      | `string`  | Location / address |
| `category`                     | `string`  | Profile category |
| `subcategory`                  | `string`  | Profile subcategory |
| `profile_completeness_score`   | `number`  | Profile completeness (0-100) |
| `profile_url`                  | `string`  | Full Snapchat profile URL |
| `creation_timestamp`           | `number`  | Account creation timestamp (ms) |
| `last_update_timestamp`        | `number`  | Last updated timestamp (ms) |
| `mutable_name`                 | `string`  | Mutable name |
| `publisher_type`               | `string`  | Publisher type (if applicable) |

---

## Error Responses
```
400 - Missing username
404 - User not found
422 - Failed to parse Snapchat data
500 - Network/fetch error
```
---

## Limitations
```
Depends on Snapchat's web structure (__NEXT_DATA__)
Only public profiles are supported
Rate limiting may apply if used excessively
Subject to change if Snapchat updates their frontend
```
---

---

### <img src="https://media.giphy.com/media/GFeFpm1jZZD0m4wlQ3/giphy.gif" width="50"> Cᴏɴᴛᴀᴄᴛ & Sᴏᴄɪᴀʟꜱ :

<p align="center">
  <a href="mailto:aryanbhalsing7090@gmail.com">
    <img src="https://img.shields.io/badge/Email-aryanbhalsing7090%40gmail.com-red?style=for-the-badge&logo=gmail" />
  </a>
  <a href="https://www.linkedin.com/in/iamaryanbhalsing">
    <img src="https://img.shields.io/badge/LinkedIn-iamaryanbhalsing-blue?style=for-the-badge&logo=linkedin" />
  </a>
  <a href="https://github.com/iamaryanbhalsing">
    <img src="https://img.shields.io/badge/GitHub-iamaryanbhalsing-black?style=for-the-badge&logo=github" />
  </a>
  <a href="https://leetcode.com/iamaryanbhalsing">
    <img src="https://img.shields.io/badge/LeetCode-Profile-orange?style=for-the-badge&logo=leetcode" />
  </a>
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="" style="max-width: 100%; display: inline-block;" data-target="animated-image.originalImage">

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=iamaryanbhalsing&label=Profile%20views&color=0e75b6&style=flat" alt="Profile views" />
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="" style="max-width: 100%; display: inline-block;" data-target="animated-image.originalImage">

<div align="center">
  <img src="https://media.giphy.com/media/vXyIMuWbGTMtO/giphy.gif" width="500" alt="Anime GIF">
</div>

<div align="center"> <b>
Tʜᴀɴᴋ Yᴏᴜ Fᴏʀ Vɪꜱɪᴛɪɴɢ Mʏ Pʀᴏꜰɪʟᴇ! ✨  
Lᴇᴛ'ꜱ Bᴜɪʟᴅ Sᴏᴍᴇᴛʜɪɴɢ Iᴍᴘᴀᴄᴛꜰᴜʟ Tᴏɢᴇᴛʜᴇʀ.
</b> </div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="" style="max-width: 100%; display: inline-block;" data-target="animated-image.originalImage">
