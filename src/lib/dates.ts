import { format, parseISO } from "date-fns";
import type { PostMeta } from "@/lib/posts";

export function formatDate(date: string): string {
  try {
    return format(parseISO(date), "MMMM d, yyyy");
  } catch {
    return date;
  }
}

export function formatShortDate(date: string): string {
  try {
    return format(parseISO(date), "MMM d, yyyy");
  } catch {
    return date;
  }
}

export function formatMonthYear(date: string): string {
  try {
    return format(parseISO(date), "MMMM yyyy");
  } catch {
    return date;
  }
}

export function monthKey(date: string): string {
  try {
    return format(parseISO(date), "yyyy-MM");
  } catch {
    return date.slice(0, 7);
  }
}

export type PostMonthGroup = {
  key: string;
  label: string;
  posts: PostMeta[];
};

export function groupPostsByMonth(posts: PostMeta[]): PostMonthGroup[] {
  const map = new Map<string, PostMonthGroup>();

  for (const post of posts) {
    const key = monthKey(post.date);
    const existing = map.get(key);
    if (existing) {
      existing.posts.push(post);
    } else {
      map.set(key, {
        key,
        label: formatMonthYear(post.date),
        posts: [post],
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => (a.key < b.key ? 1 : -1));
}
