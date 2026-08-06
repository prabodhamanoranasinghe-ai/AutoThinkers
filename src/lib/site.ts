export const siteConfig = {
  name: "AutoThinkers",
  tagline: "AI tools & tutorials for practical builders",
  description:
    "Hands-on guides to AI tools, prompts, and workflows — tutorials for creators, founders, and solo operators who want results, not hype.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://autothinkers.com",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  locale: "en_US",
  author: {
    name: "AutoThinkers Editorial",
    email: "hello@autothinkers.dev",
  },
  social: {
    twitter: "@autothinkers",
  },
  categories: [
    "AI Tools",
    "Tutorials",
    "Prompt Craft",
    "Automation",
    "Workflows",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
