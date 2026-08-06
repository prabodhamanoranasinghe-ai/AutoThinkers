import fs from "fs";
import path from "path";
import matter from "gray-matter";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://prabodhamanoranasinghe-ai.github.io/AutoThinkers";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function absoluteUrl(pathname = "/") {
  const configured = siteUrl.replace(/\/$/, "");
  const prefix = basePath.replace(/\/$/, "");
  const root =
    prefix && configured.endsWith(prefix)
      ? configured
      : `${configured}${prefix}`;
  if (!pathname || pathname === "/") return root;
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${root}${normalized}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const postsDir = path.join(process.cwd(), "content/posts");
const posts = fs
  .readdirSync(postsDir)
  .filter((name) => name.endsWith(".md"))
  .map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const { data } = matter(fs.readFileSync(path.join(postsDir, filename), "utf8"));
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || new Date().toISOString().slice(0, 10),
      category: data.category || "Deep Work",
      draft: Boolean(data.draft),
    };
  })
  .filter((post) => !post.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const items = posts
  .map((post) => {
    const url = absoluteUrl(`/blog/${post.slug}/`);
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>
    </item>`;
  })
  .join("");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AutoThinkers</title>
    <link>${absoluteUrl("/")}</link>
    <description>A niche journal for builders, researchers, and solo operators who automate the shallow so they can think deeper.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(process.cwd(), "public/rss.xml"), xml, "utf8");
console.log("Wrote public/rss.xml");
