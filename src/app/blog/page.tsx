import { BlogSearch } from "@/components/BlogSearch";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Journal",
  description:
    "AI tools & tutorials from AutoThinkers — practical guides on prompts, workflows, and automation.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.18em] text-copper uppercase">Journal</p>
        <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
          AI tools & tutorials
        </h1>
        <p className="mt-4 text-muted">
          Step-by-step guides, tool reviews, and workflow recipes — written to
          help you ship, learn, and automate with clarity. Use the category list
          on the right to browse by topic.
        </p>
      </div>

      <BlogSearch posts={posts} categories={[...siteConfig.categories]} />
    </div>
  );
}
