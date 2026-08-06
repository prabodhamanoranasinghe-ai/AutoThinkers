# AutoThinkers

A niche journal for independent thinkers — deep work, mental models, systems craft, and research practice.

**Live:** https://prabodhamanoranasinghe-ai.github.io/AutoThinkers/

## Features

- Attractive public blog (home, journal, essay pages, about)
- Detailed Markdown essays with reading time and related posts
- SEO: metadata, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt, canonical URLs, RSS
- Static export deployed to GitHub Pages (`gh-pages` branch)

## Quick start (local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How publishing works (recommended)

The public site has **no Publish tab**. Publishing is owner-only:

1. **Best for most posts:** send a topic or link in chat — the agent writes a Markdown essay into `content/posts/` and pushes to `main`
2. **Manual:** add a `.md` file under `content/posts/` (optional cover under `public/uploads/`), commit, and push
3. **Local draft studio (optional):** run `npm run dev` and open `/admin` on your machine only — generate/download Markdown, then commit it. `/admin` is **not** included in the GitHub Pages build

Pushing to `main` runs Actions, rebuilds the static site, and updates `gh-pages`.

## Deploy to GitHub Pages

Pages source should be:

- Branch: `gh-pages`
- Folder: `/ (root)`

Local static build:

```bash
npm run build:pages
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs for SEO, sitemap, RSS |
| `NEXT_PUBLIC_BASE_PATH` | `/AutoThinkers` for project Pages |
| `PUBLISH_KEY` | Local-only publish API key (`npm run dev`) |
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
