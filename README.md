# AutoThinkers

A niche journal for independent thinkers — deep work, mental models, systems craft, and research practice.

## Features

- Attractive public blog (home, journal, essay pages, about)
- Detailed Markdown essays with reading time and related posts
- **Publish studio** at `/admin`: generate a draft from a **topic** or **link**, edit SEO fields, upload a cover image, and publish
- SEO: metadata, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt, canonical URLs, RSS
- Image uploads to `/public/uploads` (PNG, JPEG, WebP, GIF, SVG)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Publish a post

1. Go to `/admin`
2. Choose **Topic** or **Link**, then generate a draft
3. Edit title, meta description, keywords, tags, and body
4. Upload or paste a cover image
5. Enter the publish key (default `autothinkers`) and publish

Published essays are saved as Markdown files in `content/posts/`.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs for SEO, sitemap, RSS |
| `PUBLISH_KEY` | Shared secret for `/admin` publish + upload APIs |

## Content

Add or edit posts in `content/posts/*.md` with frontmatter:

```yaml
title: "Your title"
description: "SEO meta description"
date: "2026-08-06"
author: "AutoThinkers Editorial"
category: "Deep Work"
tags: [focus, systems]
keywords: [deep work system, attention]
coverImage: "/images/covers/default.svg"
coverAlt: "Description of cover"
draft: false
```
