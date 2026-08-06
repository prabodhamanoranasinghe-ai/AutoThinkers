import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "About",
  description: `About ${siteConfig.name}: practical AI tools & tutorials for builders, creators, and solo operators.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">About</p>
      <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
        A practical journal for AI tools & tutorials
      </h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-soft">
        <p>
          <strong className="text-ink">{siteConfig.name}</strong> publishes
          hands-on guides to AI tools, prompts, and workflows. The audience is
          intentional: creators, founders, researchers, and solo operators who
          want usable tutorials — not launch-day hype.
        </p>
        <p>
          Expect tool walkthroughs, comparison notes, prompt patterns, and
          end-to-end workflows you can copy into your week. Every guide aims to
          leave you with a finished artifact: a prompt library, an automation,
          or a clearer stack.
        </p>
        <p>
          New posts are written as Markdown in the repository and deployed
          through GitHub Pages. Send a topic or tool link anytime and we will
          draft a tutorial for the journal.
        </p>
      </div>
    </div>
  );
}
