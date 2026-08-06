# AutoThinkers

A niche journal for independent thinkers — deep work, mental models, systems craft, and research practice.

**Live on GitHub Pages:** https://prabodhamanoranasinghe-ai.github.io/AutoThinkers/

## Features

- Attractive public blog (home, journal, essay pages, about)
- Detailed Markdown essays with reading time and related posts
- **Publish studio** at `/admin`: generate a draft from a **topic** or **link**, edit SEO fields, preview images, download Markdown for GitHub Pages
- SEO: metadata, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt, canonical URLs, RSS
- Static export ready for GitHub Pages

## Quick start (local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to GitHub Pages

1. In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. Merge this branch to `main` (or run the **Deploy to GitHub Pages** workflow)
3. Site URL: `https://prabodhamanoranasinghe-ai.github.io/AutoThinkers/`

Local static build:

```bash
npm run build:pages
```

Output is written to `out/`.

### Publishing posts on GitHub Pages

GitHub Pages is static (no server APIs). To publish:

1. Open `/admin` (or ask the agent with a topic/link)
2. Generate the draft and **Download Markdown**
3. Put the file in `content/posts/` (and images in `public/uploads/` if needed)
4. Commit and push to `main` — Actions rebuilds and deploys

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs for SEO, sitemap, RSS |
| `NEXT_PUBLIC_BASE_PATH` | `/AutoThinkers` for project Pages |
| `PUBLISH_KEY` | Local-only publish API key |
| `GITHUB_PAGES` | Set by `build:pages` for static export |

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
