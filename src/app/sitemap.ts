import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const trailing = process.env.GITHUB_PAGES === "true";
  const withSlash = (path: string) =>
    trailing && !path.endsWith("/") && !path.includes(".")
      ? `${path}/`
      : path;

  const posts = getAllPosts().map((post) => ({
    url: absoluteUrl(withSlash(`/blog/${post.slug}`)),
    lastModified: post.updated || post.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: absoluteUrl(withSlash("/")),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl(withSlash("/blog")),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl(withSlash("/about")),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...posts,
  ];
}
