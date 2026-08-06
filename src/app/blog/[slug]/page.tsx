import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { RelatedArticles } from "@/components/RelatedArticles";
import { assetPath } from "@/lib/assets";
import { formatDate } from "@/lib/dates";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { absoluteUrl, buildArticleJsonLd, buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    keywords: post.keywords || post.tags,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated || post.date,
    authors: [post.author],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 8);

  return (
    <article>
      <JsonLd data={buildArticleJsonLd(post)} />

      <header className="relative min-h-[58vh] overflow-hidden">
        <Image
          src={assetPath(post.coverImage)}
          alt={post.coverAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,18,24,0.92)] via-[rgba(11,31,42,0.55)] to-[rgba(11,31,42,0.25)]" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-4xl flex-col justify-end px-5 pb-12 pt-28 md:px-8">
          <p className="text-xs tracking-[0.18em] text-copper uppercase">
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="hover:text-fog"
            >
              {post.category}
            </Link>
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-fog md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-fog/80 md:text-lg">
            {post.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fog/70">
            <span>{post.author}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <div
          className="prose prose-blog prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mt-12 border-t border-[var(--line)] pt-8">
          <p className="text-xs tracking-[0.16em] text-muted uppercase">Tags</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?q=${encodeURIComponent(tag)}`}
                className="border border-[var(--line)] px-3 py-1.5 text-sm text-ink/75 hover:border-ink"
              >
                #{tag}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Canonical URL:{" "}
            <a
              href={post.canonical || absoluteUrl(`/blog/${post.slug}`)}
              className="text-sea"
            >
              {post.canonical || absoluteUrl(`/blog/${post.slug}`)}
            </a>
          </p>
        </div>
      </div>

      <RelatedArticles posts={related} currentSlug={slug} />
    </article>
  );
}
