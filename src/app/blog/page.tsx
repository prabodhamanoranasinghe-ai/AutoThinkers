import { BlogSearch } from "@/components/BlogSearch";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Journal",
  description:
    "Long-form essays on deep work, mental models, systems thinking, and research craft from AutoThinkers.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.18em] text-copper uppercase">Journal</p>
        <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
          Essays for deep operators
        </h1>
        <p className="mt-4 text-muted">
          Detailed writing on attention, synthesis, and systems that survive
          real weeks — optimized for readers and search engines.
        </p>
      </div>

      <BlogSearch posts={posts} />
    </div>
  );
}
