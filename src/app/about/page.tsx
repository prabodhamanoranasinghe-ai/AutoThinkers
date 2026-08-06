import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "About",
  description: `About ${siteConfig.name}: a niche journal for independent thinkers who automate shallow work to protect deep judgment.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">About</p>
      <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
        A journal for people who still think for a living
      </h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-soft">
        <p>
          <strong className="text-ink">{siteConfig.name}</strong> is a niche
          publication for builders, researchers, writers, and solo operators.
          The audience is intentionally narrow: people who own outcomes and need
          better judgment more than more content.
        </p>
        <p>
          We publish long-form essays on deep work, mental models, systems
          design, and research craft. Every post is written to be useful on a
          hard week — not just inspiring on a quiet Monday.
        </p>
        <p>
          Want a new essay? Open{" "}
          <a href="/admin" className="text-sea underline-offset-2 hover:underline">
            Publish
          </a>
          , paste a topic or source link, add a cover image, fill SEO fields,
          and ship.
        </p>
      </div>
    </div>
  );
}
