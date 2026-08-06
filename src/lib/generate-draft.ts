import slugify from "slugify";
import { siteConfig } from "@/lib/site";

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
    lower.includes("system") ||
    lower.includes("workflow") ||
    lower.includes("habit")
  ) {
    return "Systems Thinking";
  }
  if (
    lower.includes("model") ||
    lower.includes("note") ||
    lower.includes("lattice")
  ) {
    return "Mental Models";
  }
  if (
    lower.includes("automat") ||
    lower.includes("tool") ||
    lower.includes("ai")
  ) {
    return "Automation";
  }
  if (
    lower.includes("research") ||
    lower.includes("interview") ||
    lower.includes("evidence")
  ) {
    return "Research Craft";
  }
  return "Deep Work";
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
    "thinking",
    "operators",
    "craft",
  ];

  const content = `# ${title}

${angle}

${sourceNote ? `> Source context: ${sourceNote}\n` : ""}
## Why this matters for independent thinkers

If you own outcomes — as a founder, researcher, writer, or solo operator — shallow advice does not help. You need frameworks that survive messy weeks and still improve judgment.

This essay is written for that niche audience. The goal is practical clarity: models you can apply this week, not slogans.

## The core problem

Most people optimize the wrong layer. They rearrange tools, calendars, and templates while leaving the real bottleneck untouched: **unclear thinking under load**.

When priorities blur, every notification feels urgent. When claims are vague, research expands forever. When systems have no failure mode, one bad day breaks the chain.

## A working model

Use this three-layer model:

1. **Question** — What decision gets better if we understand this?
2. **Claim** — What falsifiable statement are we testing?
3. **System** — What weekly ritual keeps the claim in contact with reality?

If you cannot fill those three lines, you are collecting activity, not producing insight.

### Practical checklist

- Write the decision in one sentence before opening tabs
- Limit active questions to a small set (3–7)
- Protect at least two maker blocks each week
- Review evidence that contradicts your favorite model
- End the day with a shutdown note: what moved, what is parked

## How to apply this in one week

### Day 1 — Frame

Write your weekly thesis:

> The most valuable thinking I can do this week is ____.

### Day 2–3 — Contact time

Run two uninterrupted blocks on that thesis. Produce an artifact: memo, prototype, interview synthesis, or decision record.

### Day 4 — Stress test

Ask what would falsify your current claim. Gather one piece of disconfirming evidence on purpose.

### Day 5 — Ship a decision

Convert the work into a recommendation someone can act on. Thinking that never becomes a decision is unfinished inventory.

## What to automate

Automate transport and formatting:

- Capture and filing
- Transcription
- Reminders for reviews you already trust

Do not automate taste and priority. Those are your competitive advantage.

## Closing

${title.replace(/:$/, "")} is less about motivation and more about design. Build a small system around clear questions, protected attention, and honest feedback. Then let the system compound.

If you want the next essay, bring a topic or a source link to Publish — AutoThinkers will draft, SEO-tag, and prepare it for the journal.
`;

  return {
    title,
    description: angle.slice(0, 155),
    content,
    category,
    tags,
    keywords: [...tags, "autothinkers", "deep work", slug.replace(/-/g, " ")],
    coverImage: "/images/covers/default.svg",
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
