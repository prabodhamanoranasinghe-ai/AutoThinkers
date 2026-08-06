"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PostListItem } from "@/components/PostListItem";
import { groupPostsByMonth } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";

type BlogSearchProps = {
  posts: PostMeta[];
  categories: string[];
};

function normalizeCategory(value: string | null | undefined) {
  return (value || "").trim().toLowerCase();
}

export function BlogSearch({ posts, categories }: BlogSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    initialCategory ? { [initialCategory]: true } : {},
  );

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    const nextCategory = searchParams.get("category") || "";
    setActiveCategory(nextCategory);
    if (nextCategory) {
      setExpanded((prev) => ({ ...prev, [nextCategory]: true }));
    }
  }, [searchParams]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of posts) {
      map.set(post.category, (map.get(post.category) || 0) + 1);
    }
    return map;
  }, [posts]);

  const categoryList = useMemo(() => {
    const fromConfig = categories.filter((name) => (counts.get(name) || 0) > 0);
    const extras = [...counts.keys()]
      .filter((name) => !categories.includes(name))
      .sort((a, b) => a.localeCompare(b));
    return [...fromConfig, ...extras];
  }, [categories, counts]);

  const postsByCategory = useMemo(() => {
    const map = new Map<string, PostMeta[]>();
    for (const post of posts) {
      const list = map.get(post.category) || [];
      list.push(post);
      map.set(post.category, list);
    }
    return map;
  }, [posts]);

  const updateUrl = useCallback(
    (next: { category?: string; q?: string }) => {
      const params = new URLSearchParams();
      const category = next.category ?? activeCategory;
      const q = next.q ?? query;
      if (category) params.set("category", category);
      if (q.trim()) params.set("q", q.trim());
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [activeCategory, pathname, query, router],
  );

  const selectCategory = (category: string, { toggle = true } = {}) => {
    const isSame =
      normalizeCategory(activeCategory) === normalizeCategory(category);
    const next = toggle && isSame ? "" : category;
    setActiveCategory(next);
    if (next) {
      setExpanded((prev) => ({ ...prev, [next]: true }));
    }
    updateUrl({ category: next });
  };

  const toggleExpand = (category: string) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selected = normalizeCategory(activeCategory);

    return posts.filter((p) => {
      if (selected && normalizeCategory(p.category) !== selected) {
        return false;
      }
      if (!q) return true;
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
  }, [posts, query, activeCategory]);

  const monthGroups = useMemo(() => groupPostsByMonth(filtered), [filtered]);

  const activeLabel = activeCategory || "All categories";

  return (
    <div className="mt-10">
      <form
        className="grid gap-3 md:grid-cols-[1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          updateUrl({ q: query });
        }}
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

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div className="order-2 lg:order-1">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line)] pb-4">
            <div>
              <p className="text-xs tracking-[0.16em] text-muted uppercase">
                Showing
              </p>
              <h2 className="mt-1 font-display text-2xl text-ink md:text-3xl">
                {activeLabel}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {filtered.length}{" "}
                {filtered.length === 1 ? "article" : "articles"}
                {query.trim() ? ` matching “${query.trim()}”` : ""}
              </p>
            </div>
            {activeCategory ? (
              <button
                type="button"
                onClick={() => selectCategory(activeCategory)}
                className="text-sm text-sea underline-offset-4 hover:underline"
              >
                Clear category
              </button>
            ) : null}
          </div>

          <div className="space-y-14">
            {filtered.length === 0 ? (
              <p className="border-t border-[var(--line)] py-10 text-muted">
                No essays matched. Try another category or keyword.
              </p>
            ) : (
              monthGroups.map((group) => (
                <section
                  key={group.key}
                  aria-labelledby={`blog-month-${group.key}`}
                >
                  <div className="mb-2 flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
                    <h3
                      id={`blog-month-${group.key}`}
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
                      <PostListItem
                        key={post.slug}
                        post={post}
                        index={index}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>

        <aside
          className="order-1 lg:sticky lg:top-24 lg:order-2"
          aria-labelledby="journal-categories-heading"
        >
          <div className="border border-[var(--line)] bg-[rgba(255,255,255,0.45)] p-5">
            <p className="text-xs tracking-[0.16em] text-copper uppercase">
              Browse
            </p>
            <h2
              id="journal-categories-heading"
              className="mt-2 font-display text-2xl text-ink"
            >
              Categories
            </h2>
            <p className="mt-2 text-sm text-muted">
              Click a category to filter the journal, or expand to preview its
              posts here.
            </p>

            <ul className="mt-5 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("");
                    updateUrl({ category: "" });
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition ${
                    !activeCategory
                      ? "bg-ink text-fog"
                      : "text-ink/80 hover:bg-[rgba(11,31,42,0.04)]"
                  }`}
                >
                  <span>All articles</span>
                  <span className="font-mono text-xs opacity-80">
                    {posts.length}
                  </span>
                </button>
              </li>

              {categoryList.map((category) => {
                const isActive =
                  normalizeCategory(activeCategory) ===
                  normalizeCategory(category);
                const isOpen = Boolean(expanded[category]);
                const categoryPosts = postsByCategory.get(category) || [];
                const count = counts.get(category) || 0;

                return (
                  <li
                    key={category}
                    className="border-t border-[var(--line)] first:border-t-0"
                  >
                    <div className="flex items-stretch">
                      <button
                        type="button"
                        onClick={() => selectCategory(category)}
                        className={`flex min-w-0 flex-1 items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition ${
                          isActive
                            ? "bg-ink text-fog"
                            : "text-ink/80 hover:bg-[rgba(11,31,42,0.04)]"
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className="truncate">{category}</span>
                        <span className="shrink-0 font-mono text-xs opacity-80">
                          {count}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleExpand(category)}
                        className={`shrink-0 border-l border-[var(--line)] px-2.5 text-sm transition ${
                          isActive
                            ? "bg-ink text-fog/80"
                            : "text-muted hover:bg-[rgba(11,31,42,0.04)] hover:text-ink"
                        }`}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${category} posts`}
                      >
                        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                      </button>
                    </div>

                    {isOpen ? (
                      <ul className="border-t border-[var(--line)] bg-[rgba(255,255,255,0.35)] py-2">
                        {categoryPosts.length === 0 ? (
                          <li className="px-3 py-2 text-xs text-muted">
                            No posts yet
                          </li>
                        ) : (
                          categoryPosts.map((post) => (
                            <li key={post.slug}>
                              <Link
                                href={`/blog/${post.slug}`}
                                className="block px-3 py-2 text-sm leading-snug text-ink/75 transition hover:text-sea"
                              >
                                {post.title}
                              </Link>
                            </li>
                          ))
                        )}
                        <li className="px-3 pb-1 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              selectCategory(category, { toggle: false })
                            }
                            className="text-xs tracking-[0.08em] text-sea uppercase underline-offset-4 hover:underline"
                          >
                            View all in journal →
                          </button>
                        </li>
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
