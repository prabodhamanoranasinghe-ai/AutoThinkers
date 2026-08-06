---
title: "Prompt Craft Tutorial: Write AI Prompts That Survive Real Work"
description: "A step-by-step prompt engineering tutorial with copy-paste templates for drafting, research, critique, and repetitive operations."
date: "2026-08-05"
author: "AutoThinkers Editorial"
category: "Prompt Craft"
tags:
  - prompts
  - chatgpt
  - claude
  - tutorials
keywords:
  - prompt engineering tutorial
  - how to write better AI prompts
  - ChatGPT prompt templates
  - Claude prompt examples
coverImage: "/images/covers/prompt-craft.svg"
coverAlt: "Abstract lines suggesting structured prompt flows"
draft: false
---

Bad prompts create busywork. Good prompts create **repeatable leverage**.

This tutorial teaches a prompt pattern you can reuse across ChatGPT, Claude, Gemini, and most coding assistants.

## The 5-part prompt pattern

Every strong work prompt includes:

1. **Role** — who the model should act like
2. **Objective** — the finished artifact
3. **Context** — only the facts that matter
4. **Constraints** — tone, length, what to avoid
5. **Output format** — exact structure you want back

If any piece is missing, quality drops.

### Master template

```text
Role: {{expert type}}
Objective: {{finished artifact}}
Audience: {{who will read/use this}}
Context:
- {{fact 1}}
- {{fact 2}}
Constraints:
- {{style / length / must-include / must-avoid}}
Output format:
- {{bullets / table / sections / JSON}}
Do not invent facts. If information is missing, ask up to 3 clarifying questions first.
```

## Tutorial 1: Drafting a useful blog outline (10 minutes)

**Prompt**

```text
Role: editorial strategist for an AI tools blog.
Objective: create an outline for a practical tutorial.
Topic: {{topic}}
Audience: beginners who are busy and skeptical of hype.
Constraints:
- Include a clear outcome in the intro
- Prefer steps over theory
- Add a mistakes section
- Keep SEO keywords natural
Output format:
1. Title options (3)
2. Meta description
3. H2/H3 outline
4. Internal link ideas
```

**What “good” looks like:** you can start writing immediately without another brainstorming session.

## Tutorial 2: Research assist without fake citations (15 minutes)

```text
Role: careful research assistant.
Objective: summarize what is known and unknown about {{topic}}.
Constraints:
- Separate verified facts, common claims, and open questions
- Do not invent citations
- Flag anything that needs primary-source checking
Output format:
| Claim | Confidence | How to verify |
Then: 5 follow-up search queries.
```

Use the table as a checklist. Click through and verify before you publish.

## Tutorial 3: Critique and tighten your own draft (8 minutes)

```text
Role: strict editor.
Objective: improve clarity and usefulness.
Paste draft below.
Constraints:
- No generic praise
- Preserve my voice
- Cut hype words
Output:
1. Top 5 problems
2. Line edits for the intro
3. A stronger checklist ending
Draft:
{{paste}}
```

## Tutorial 4: Turn meetings into actions (5 minutes)

```text
Role: chief of staff.
Objective: extract decisions and next actions from this transcript.
Constraints:
- Ignore small talk
- Mark owners and due dates when stated
- List unresolved questions separately
Output:
## Decisions
## Actions (owner · task · deadline)
## Risks
## Customer language worth saving
Transcript:
{{paste}}
```

## Prompt library starter pack

Save these names in your notes app:

- `outline.v1`
- `draft.v1`
- `critique.v1`
- `research.v1`
- `meeting-actions.v1`
- `sop-from-notes.v1`

Version them. When a prompt improves, bump `v1` → `v2` instead of overwriting blindly.

## Evaluation checklist

Before you trust an AI answer, ask:

1. Did it follow the output format?
2. Did it invent specifics you did not provide?
3. Can you verify the key claims in 5 minutes?
4. Would you send this to a client after one edit pass?

If the answer to #4 is no, improve the prompt — do not just regenerate forever.

## Common prompt mistakes

- “Write something good about AI tools” (no objective)
- Dumping an entire company wiki into every chat
- Asking for citations the model cannot reliably provide
- Accepting the first answer because it sounds confident
- Never saving the prompt that worked

## Closing

Prompt craft is not magic language. It is product requirements writing for a model.

Use the 5-part pattern, keep a tiny prompt library, and judge outputs by whether they reduce your next hour of work. That is the difference between AI as entertainment and AI as infrastructure.

## Related Articles

Keep exploring on AutoThinkers — these 7 guides pair well with this one:

- [The Practical AI Toolkit for Solo Operators (2026)](/blog/practical-ai-toolkit-solo-operators/)
- [Tutorial: Build an AI Content Workflow in 60 Minutes](/blog/ai-content-workflow-60-minutes/)
- [AI for Students: How to Study Smarter with ChatGPT, Claude & Free AI Tools (2026 Guide)](/blog/ai-for-students-study-smarter/)
- [AI for Small Business: A Practical Playbook That Pays for Itself](/blog/ai-for-small-business-playbook/)
- [The Attention Budget: Why Deep Thinkers Treat Focus Like Capital](/blog/attention-budget-deep-work/)
- [Designing Personal Systems That Survive Contact With Real Weeks](/blog/personal-systems-that-survive/)
- [Lattice Thinking: How to Connect Ideas Without Drowning in Notes](/blog/lattice-thinking-idea-networks/)
- [Best ChatGPT Prompts for Students](/blog/best-chatgpt-prompts-for-students/)
- [ChatGPT vs Claude vs Gemini: Which AI Should You Use in 2026?](/blog/chatgpt-vs-claude-vs-gemini/)
