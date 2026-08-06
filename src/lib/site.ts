export const siteConfig = {
  name: "AutoThinkers",
  tagline: "Deep work for independent minds",
  description:
    "A niche journal for builders, researchers, and solo operators who automate the shallow so they can think deeper — mental models, systems craft, and focused writing.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://prabodhamanoranasinghe-ai.github.io/AutoThinkers",
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
    "Mental Models",
    "Systems Thinking",
    "Deep Work",
    "Research Craft",
    "Automation",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
