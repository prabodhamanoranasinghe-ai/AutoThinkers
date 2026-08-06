import Link from "next/link";
import { formatShortDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";

export function PostListItem({
  post,
  index = 0,
}: {
  post: PostMeta;
  index?: number;
}) {
  return (
    <article
      className="group border-t border-[var(--line)] py-8 first:border-t-0 first:pt-0"
      style={{ animationDelay: `${Math.min(index, 6) * 0.06}s` }}
    >
      <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-start">
        <div className="space-y-2 text-sm text-muted">
          <p className="tracking-[0.14em] text-copper uppercase">
            {post.category}
          </p>
          <time dateTime={post.date}>{formatShortDate(post.date)}</time>
          <p>{post.readingTime}</p>
        </div>
        <div>
          <h3 className="font-display text-2xl leading-snug text-ink md:text-[1.75rem]">
            <Link
              href={`/blog/${post.slug}`}
              className="transition-colors hover:text-sea"
            >
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-muted">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs tracking-wide text-ink/55">
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
