import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import slugify from "slugify";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  draft?: boolean;
  keywords?: string[];
  canonical?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
  readingMinutes: number;
};

export type Post = PostMeta & {
  content: string;
  contentHtml: string;
};

function ensurePostsDir() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

function parsePostFile(filename: string): PostMeta | null {
  const slug = filename.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  if (data.draft === true && process.env.NODE_ENV === "production") {
    return null;
  }

  return {
    slug,
    title: data.title || "Untitled",
    description: data.description || "",
    date: data.date || new Date().toISOString().slice(0, 10),
    updated: data.updated,
    author: data.author || "AutoThinkers Editorial",
    category: data.category || "Deep Work",
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage || "/images/covers/default.svg",
    coverAlt: data.coverAlt || data.title || "Article cover",
    draft: Boolean(data.draft),
    keywords: Array.isArray(data.keywords) ? data.keywords : data.tags || [],
    canonical: data.canonical,
    readingTime: stats.text,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
  };
}

export function getAllPosts(): PostMeta[] {
  ensurePostsDir();
  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"));

  return filenames
    .map(parsePostFile)
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(
    (post) => post.category.toLowerCase() === category.toLowerCase(),
  );
}

export function getRelatedPosts(slug: string, limit = 8): PostMeta[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  const currentKeywords = new Set(
    [...current.tags, ...(current.keywords || [])].map((k) => k.toLowerCase()),
  );
  const currentWords = new Set(
    `${current.title} ${current.description} ${current.category}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3),
  );

  const max = Math.min(limit, Math.max(0, all.length - 1));

  return all
    .filter((p) => p.slug !== slug)
    .map((post) => {
      const postKeywords = [...post.tags, ...(post.keywords || [])].map((k) =>
        k.toLowerCase(),
      );
      const keywordOverlap = postKeywords.filter((k) =>
        currentKeywords.has(k),
      ).length;
      const sameCategory = post.category === current.category ? 3 : 0;
      const titleWords = `${post.title} ${post.description}`
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 3);
      const wordOverlap = titleWords.filter((w) => currentWords.has(w)).length;
      const score = keywordOverlap * 2 + sameCategory + wordOverlap;
      return { post, score };
    })
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, max)
    .map(({ post }) => post);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensurePostsDir();
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  if (data.draft === true && process.env.NODE_ENV === "production") {
    return null;
  }

  const processed = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title || "Untitled",
    description: data.description || "",
    date: data.date || new Date().toISOString().slice(0, 10),
    updated: data.updated,
    author: data.author || "AutoThinkers Editorial",
    category: data.category || "Deep Work",
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage || "/images/covers/default.svg",
    coverAlt: data.coverAlt || data.title || "Article cover",
    draft: Boolean(data.draft),
    keywords: Array.isArray(data.keywords) ? data.keywords : data.tags || [],
    canonical: data.canonical,
    readingTime: stats.text,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    content,
    contentHtml,
  };
}

export type CreatePostInput = {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  author?: string;
  keywords?: string[];
  canonical?: string;
  draft?: boolean;
  slug?: string;
  date?: string;
};

export function createPostFile(input: CreatePostInput): { slug: string; path: string } {
  ensurePostsDir();
  const slug =
    input.slug ||
    slugify(input.title, { lower: true, strict: true, trim: true });

  const target = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(target) && !input.slug) {
    throw new Error(`A post with slug "${slug}" already exists`);
  }

  const frontmatter = {
    title: input.title,
    description: input.description,
    date: input.date || new Date().toISOString().slice(0, 10),
    author: input.author || "AutoThinkers Editorial",
    category: input.category,
    tags: input.tags,
    keywords: input.keywords || input.tags,
    coverImage: input.coverImage,
    coverAlt: input.coverAlt,
    draft: input.draft ?? false,
    ...(input.canonical ? { canonical: input.canonical } : {}),
  };

  const yaml = matter.stringify(input.content.trim() + "\n", frontmatter);
  fs.writeFileSync(target, yaml, "utf8");

  return { slug, path: target };
}
