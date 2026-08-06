import slugify from "slugify";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

/** Markdown "Related Articles" block for drafts — links 5–10 existing posts for SEO reach. */
export function buildRelatedArticlesMarkdown(
  excludeSlug?: string,
  limit = 8,
): string {
  const posts = getAllPosts()
    .filter((post) => post.slug !== excludeSlug)
    .slice(0, Math.min(limit, 10));

  if (posts.length === 0) {
    return `## Related Articles

After you publish more AutoThinkers guides, link 5–10 related posts here (same topic, tools, or audience) so readers — and search engines — can keep exploring the archive.
`;
  }

  const links = posts
    .map((post) => `- [${post.title}](/blog/${post.slug}/)`)
    .join("\n");

  return `## Related Articles

Keep exploring on AutoThinkers — these ${posts.length} guides pair well with this one:

${links}
`;
}

export type GenerateMode = "topic" | "link";

export type GeneratedDraft = {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  keywords: string[];
  coverImage: string;
  coverAlt: string;
  slug: string;
  canonical?: string;
  sourceUrl?: string;
};

function pickCategory(text: string): string {
  const lower = text.toLowerCase();
  if (
    lower.includes(" vs ") ||
    lower.includes("versus") ||
    lower.includes("compared") ||
    lower.includes("comparison")
  ) {
    return "Comparisons";
  }
  if (lower.includes("prompt") || lower.includes("chatgpt") || lower.includes("claude")) {
    return "Prompt Craft";
  }
  if (
    lower.includes("workflow") ||
    lower.includes("pipeline") ||
    lower.includes("stack")
  ) {
    return "Workflows";
  }
  if (
    lower.includes("tutorial") ||
    lower.includes("how to") ||
    lower.includes("step-by-step") ||
    lower.includes("guide")
  ) {
    return "Tutorials";
  }
  if (
    lower.includes("automat") ||
    lower.includes("zapier") ||
    lower.includes("make.com") ||
    lower.includes("n8n")
  ) {
    return "Automation";
  }
  if (
    lower.includes("tool") ||
    lower.includes("ai") ||
    lower.includes("gpt") ||
    lower.includes("model")
  ) {
    return "AI Tools";
  }
  return "AI Tools";
}

function buildEssay({
  title,
  angle,
  sourceNote,
  category,
}: {
  title: string;
  angle: string;
  sourceNote?: string;
  category: string;
}): GeneratedDraft {
  const slug = slugify(title, { lower: true, strict: true, trim: true });
  const tags = [
    category.toLowerCase().replace(/\s+/g, "-"),
    "ai-tools",
    "tutorials",
    "workflows",
  ];

  const content = `# ${title}

${angle}

${sourceNote ? `> Source context: ${sourceNote}\n` : ""}
## Who this guide is for

Creators, founders, researchers, and solo operators who want AI to save time
without creating a second job of “prompt babysitting.”

## What you will build

By the end of this guide you should leave with:

1. A clear use case
2. A repeatable prompt or workflow
3. A short checklist you can reuse next week

## Step-by-step

### 1. Define the outcome

Write one sentence:

> When this works, I will have ____.

### 2. Pick the smallest useful tool stack

Prefer one strong model + one notes app over five overlapping tools.

### 3. Draft the operating prompt

Include role, constraints, input format, and output format. Save it where you
actually work.

### 4. Run a 20-minute test

Use a real task, not a demo. Capture what broke.

### 5. Turn the win into a reusable recipe

Document the prompt, the tool, and the failure modes.

## Common mistakes

- Collecting tools instead of finishing workflows
- Skipping evaluation criteria
- Pasting sensitive data into the wrong product
- Accepting first-draft AI output without editing

## Closing

${title.replace(/:$/, "")} is useful only when it becomes a habit. Start small,
measure one outcome, and expand only after the workflow survives a busy week.

${buildRelatedArticlesMarkdown(slug, 8)}
`;

  return {
    title,
    description: angle.slice(0, 155),
    content,
    category,
    tags,
    keywords: [...tags, "autothinkers", "ai tutorials", slug.replace(/-/g, " ")],
    coverImage: "/images/covers/ai-tools.svg",
    coverAlt: `Cover image for ${title}`,
    slug,
  };
}

export function generateFromTopic(topic: string): GeneratedDraft {
  const trimmed = topic.trim();
  const title = trimmed.endsWith("?")
    ? trimmed
    : trimmed.length > 70
      ? `${trimmed.slice(0, 67)}…`
      : trimmed;
  const category = pickCategory(trimmed);
  return buildEssay({
    title,
    angle: `A practical AutoThinkers deep-dive on “${trimmed}” — written for operators who need clearer judgment, not more noise.`,
    category,
  });
}

export function generateFromLinkMeta({
  url,
  title: rawTitle,
  description,
  image,
  text,
}: {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  text?: string;
}): GeneratedDraft {
  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {
    /* keep raw */
  }

  const baseTitle = rawTitle || `Notes on ${hostname}`;
  const title = baseTitle.length > 90 ? `${baseTitle.slice(0, 87)}…` : baseTitle;
  const category = pickCategory(
    `${title} ${description || ""} ${text || ""}`,
  );
  const angle =
    description ||
    `An AutoThinkers response essay based on source material from ${hostname}, distilled into operator-ready principles.`;

  const draft = buildEssay({
    title: `Rethinking: ${title}`,
    angle,
    sourceNote: `${url} — ${(text || "").slice(0, 280)}${(text || "").length > 280 ? "…" : ""}`,
    category,
  });

  if (image) {
    draft.coverImage = image;
    draft.coverAlt = `Image referenced from ${hostname}`;
  }

  draft.sourceUrl = url;
  return draft;
}

export function toMarkdownFile(input: {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  keywords: string[];
  coverImage: string;
  coverAlt: string;
  slug?: string;
  canonical?: string;
  draft?: boolean;
  author?: string;
  date?: string;
}): { filename: string; markdown: string; slug: string } {
  const slug =
    input.slug ||
    slugify(input.title, { lower: true, strict: true, trim: true });
  const date = input.date || new Date().toISOString().slice(0, 10);
  const tags = input.tags.map((tag) => `  - ${tag}`).join("\n");
  const keywords = (input.keywords.length ? input.keywords : input.tags)
    .map((keyword) => `  - ${keyword}`)
    .join("\n");

  const markdown = `---
title: ${JSON.stringify(input.title)}
description: ${JSON.stringify(input.description)}
date: ${JSON.stringify(date)}
author: ${JSON.stringify(input.author || siteConfig.author.name)}
category: ${JSON.stringify(input.category)}
tags:
${tags}
keywords:
${keywords}
coverImage: ${JSON.stringify(input.coverImage)}
coverAlt: ${JSON.stringify(input.coverAlt)}
draft: ${input.draft ? "true" : "false"}
${input.canonical ? `canonical: ${JSON.stringify(input.canonical)}\n` : ""}---

${input.content.trim()}
`;

  return { filename: `${slug}.md`, markdown, slug };
}
