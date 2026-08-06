import Image from "next/image";
import Link from "next/link";
import { PostListItem } from "@/components/PostListItem";
import { assetPath } from "@/lib/assets";
import { formatShortDate, groupPostsByMonth } from "@/lib/dates";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildPageMetadata({
  path: "/",
});

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts[0];
  const monthGroups = groupPostsByMonth(posts);

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={assetPath(featured?.coverImage || "/images/covers/default.svg")}
            alt={
              featured?.coverAlt ||
              "Atmospheric backdrop for AI tools and tutorials"
            }
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,20,28,0.88)] via-[rgba(11,31,42,0.72)] to-[rgba(11,31,42,0.35)]" />
          <div className="hero-glow absolute -right-20 top-16 h-72 w-72 rounded-full bg-copper/25 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-20">
          <p className="reveal font-display text-5xl leading-none tracking-tight text-fog md:text-7xl lg:text-8xl">
            {siteConfig.name}
          </p>
          <div className="accent-line mt-5 h-px w-28 bg-copper" />
          <h1 className="reveal reveal-delay-1 mt-6 max-w-2xl font-display text-2xl leading-snug text-fog md:text-3xl">
            {siteConfig.tagline}
          </h1>
          <p className="reveal reveal-delay-2 mt-4 max-w-xl text-base leading-relaxed text-fog/80 md:text-lg">
            Practical tutorials on AI tools, prompts, and workflows — so you can
            ship faster without drowning in hype.
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className="btn-primary bg-fog text-ink hover:bg-white">
              Browse tutorials
            </Link>
            <Link
              href="/about"
              className="btn-secondary border-fog/40 text-fog hover:border-fog hover:bg-white/10"
            >
              About AutoThinkers
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-copper uppercase">
              Latest guides
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              From the journal
            </h2>
          </div>
          <Link href="/blog" className="hidden text-sm text-sea md:inline">
            View all tutorials →
          </Link>
        </div>

        {featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid gap-8 border-t border-[var(--line)] pt-10 md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-ink-soft">
              <Image
                src={assetPath(featured.coverImage)}
                alt={featured.coverAlt}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs tracking-[0.16em] text-copper uppercase">
                {featured.category} · {formatShortDate(featured.date)}
              </p>
              <h3 className="mt-3 font-display text-3xl leading-tight text-ink transition group-hover:text-sea md:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {featured.description}
              </p>
              <p className="mt-6 text-sm text-ink/60">{featured.readingTime}</p>
            </div>
          </Link>
        ) : null}

        <div className="mt-16 space-y-14">
          {monthGroups.map((group) => (
            <section key={group.key} aria-labelledby={`month-${group.key}`}>
              <div className="mb-2 flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
                <h3
                  id={`month-${group.key}`}
                  className="font-display text-2xl text-ink md:text-3xl"
                >
                  {group.label}
                </h3>
                <p className="text-sm text-muted">
                  {group.posts.length}{" "}
                  {group.posts.length === 1 ? "article" : "articles"}
                </p>
              </div>
              <div>
                {group.posts.map((post, index) => (
                  <PostListItem key={post.slug} post={post} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[rgba(255,255,255,0.35)]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <p className="text-xs tracking-[0.18em] text-copper uppercase">
            What we publish
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink md:text-4xl">
            AI tools explained. Tutorials you can finish in one sitting.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Tool roundups, step-by-step walkthroughs, prompt patterns, and
            workflow recipes for people who use AI to get real work done.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {siteConfig.categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${encodeURIComponent(category)}`}
                className="border border-[var(--line)] px-3 py-1.5 text-sm text-ink/75 transition hover:border-ink hover:text-ink"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
