import Image from "next/image";
import Link from "next/link";
import { PostListItem } from "@/components/PostListItem";
import { formatShortDate } from "@/lib/dates";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/",
});

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1, 4);

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/covers/default.svg"
            alt="Atmospheric study space for deep thinking"
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
            Essays on attention, mental models, and resilient systems for people
            who still do original thinking.
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className="btn-primary bg-fog text-ink hover:bg-white">
              Read the journal
            </Link>
            <Link
              href="/admin"
              className="btn-secondary border-fog/40 text-fog hover:border-fog hover:bg-white/10"
            >
              Write & publish
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-copper uppercase">
              Latest thinking
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              From the journal
            </h2>
          </div>
          <Link href="/blog" className="hidden text-sm text-sea md:inline">
            View all essays →
          </Link>
        </div>

        {featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid gap-8 border-t border-[var(--line)] pt-10 md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-ink-soft">
              <Image
                src={featured.coverImage}
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

        <div className="mt-6">
          {rest.map((post, index) => (
            <PostListItem key={post.slug} post={post} index={index} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[rgba(255,255,255,0.35)]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <p className="text-xs tracking-[0.18em] text-copper uppercase">
            Niche audience
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink md:text-4xl">
            Built for independent minds who automate the shallow.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Give us a topic or a link in Publish — we structure the draft, SEO
            fields, and cover image so you can ship a detailed essay quickly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {siteConfig.categories.map((category) => (
              <span
                key={category}
                className="border border-[var(--line)] px-3 py-1.5 text-sm text-ink/75"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
