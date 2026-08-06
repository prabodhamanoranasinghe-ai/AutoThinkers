import { PostListItem } from "@/components/PostListItem";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Journal",
  description:
    "Long-form essays on deep work, mental models, systems thinking, and research craft from AutoThinkers.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim().toLowerCase();
  const category = (params.category || "").trim().toLowerCase();
  let posts = getAllPosts();

  if (category) {
    posts = posts.filter((p) => p.category.toLowerCase() === category);
  }

  if (query) {
    posts = posts.filter((p) => {
      const haystack = [
        p.title,
        p.description,
        p.category,
        ...p.tags,
        ...(p.keywords || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

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

      <form className="mt-10 grid gap-3 md:grid-cols-[1fr_auto]" action="/blog">
        <input
          className="field"
          type="search"
          name="q"
          defaultValue={params.q || ""}
          placeholder="Search essays, tags, keywords…"
          aria-label="Search posts"
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="mt-12">
        {posts.length === 0 ? (
          <p className="border-t border-[var(--line)] py-10 text-muted">
            No essays matched that search. Try another keyword or publish a new
            piece.
          </p>
        ) : (
          posts.map((post, index) => (
            <PostListItem key={post.slug} post={post} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
