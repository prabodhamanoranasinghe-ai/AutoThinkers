"use client";

import { useMemo, useState } from "react";
import { PostListItem } from "@/components/PostListItem";
import { groupPostsByMonth } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";

export function BlogSearch({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const haystack = [
        p.title,
        p.description,
        p.category,
        ...p.tags,
        ...(p.keywords || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query]);

  const monthGroups = useMemo(() => groupPostsByMonth(filtered), [filtered]);

  return (
    <>
      <form
        className="mt-10 grid gap-3 md:grid-cols-[1fr_auto]"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="field"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search essays, tags, keywords…"
          aria-label="Search posts"
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="mt-12 space-y-14">
        {filtered.length === 0 ? (
          <p className="border-t border-[var(--line)] py-10 text-muted">
            No essays matched that search. Try another keyword or publish a new
            piece.
          </p>
        ) : (
          monthGroups.map((group) => (
            <section key={group.key} aria-labelledby={`blog-month-${group.key}`}>
              <div className="mb-2 flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
                <h2
                  id={`blog-month-${group.key}`}
                  className="font-display text-2xl text-ink md:text-3xl"
                >
                  {group.label}
                </h2>
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
          ))
        )}
      </div>
    </>
  );
}
