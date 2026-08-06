import { PostListItem } from "@/components/PostListItem";
import { JsonLd } from "@/components/JsonLd";
import type { PostMeta } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

export function RelatedArticles({
  posts,
  currentSlug,
}: {
  posts: PostMeta[];
  currentSlug: string;
}) {
  if (posts.length === 0) return null;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Related Articles",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/blog/${post.slug}`),
      name: post.title,
    })),
  };

  return (
    <section
      className="border-t border-[var(--line)] bg-[rgba(255,255,255,0.3)]"
      aria-labelledby="related-articles-heading"
    >
      <JsonLd data={itemList} />
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <p className="text-xs tracking-[0.18em] text-copper uppercase">
          Keep exploring
        </p>
        <h2
          id="related-articles-heading"
          className="mt-2 font-display text-3xl text-ink md:text-4xl"
        >
          Related Articles
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Continue with {posts.length} closely related AutoThinkers guides —
          more tutorials to deepen your AI workflow.
        </p>
        <div className="mt-8">
          {posts.map((item, index) => (
            <PostListItem key={`${currentSlug}-${item.slug}`} post={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
