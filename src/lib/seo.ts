import type { Metadata } from "next";
import { siteConfig } from "./site";
import type { PostMeta } from "./posts";

/** Next metadata/image routes that must NOT get a trailing slash on Pages. */
const NO_TRAILING_SLASH_PATHS = new Set([
  "/opengraph-image",
  "/twitter-image",
  "/icon",
  "/apple-icon",
]);

function withTrailingSlash(path: string): string {
  if (!path || path === "/") return "/";
  if (path.includes("?") || path.includes("#") || path.includes(".")) {
    return path;
  }
  const bare = path.replace(/\/$/, "") || "/";
  if (NO_TRAILING_SLASH_PATHS.has(bare)) {
    return bare;
  }
  return path.endsWith("/") ? path : `${path}/`;
}

export function absoluteUrl(path = "/"): string {
  const configured = siteConfig.url.replace(/\/$/, "");
  const basePath = siteConfig.basePath.replace(/\/$/, "");
  // SITE_URL may already include the basePath (GitHub Pages project URL).
  const root =
    basePath && configured.endsWith(basePath)
      ? configured
      : `${configured}${basePath}`;

  // GitHub Pages is served with trailingSlash URLs — keep canonicals consistent.
  const useTrailingSlash =
    process.env.GITHUB_PAGES === "true" ||
    process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

  if (!path || path === "/") {
    return useTrailingSlash ? `${root}/` : root;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const finalPath = useTrailingSlash
    ? withTrailingSlash(normalized)
    : normalized;
  return `${root}${finalPath}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): Metadata {
  // Keep `title` bare so the root layout template (`%s · AutoThinkers`)
  // does not produce "Title · AutoThinkers · AutoThinkers".
  const brandedTitle = title
    ? `${title} · ${siteConfig.name}`
    : `${siteConfig.name} · ${siteConfig.tagline}`;
  const pageDescription = description || siteConfig.description;
  const url = absoluteUrl(path);
  // Prefer the .png copy produced by build:github-pages (correct Content-Type
  // on GitHub Pages). Trailing-slash URLs like /opengraph-image/ 404.
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl("/opengraph-image.png");

  return {
    title: title || brandedTitle,
    description: pageDescription,
    keywords: keywords?.length ? keywords : [...siteConfig.categories],
    authors: (authors || [siteConfig.author.name]).map((name) => ({ name })),
    creator: siteConfig.author.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: brandedTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors: authors || [siteConfig.author.name],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description: pageDescription,
      images: [ogImage],
      creator: siteConfig.social.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildArticleJsonLd(post: PostMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [absoluteUrl(post.coverImage)],
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
    keywords: (post.keywords || post.tags).join(", "),
    articleSection: post.category,
    inLanguage: "en",
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/blog")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
