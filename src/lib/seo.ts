import type { Metadata } from "next";
import { siteConfig } from "./site";
import type { PostMeta } from "./posts";

export function absoluteUrl(path = "/"): string {
  const configured = siteConfig.url.replace(/\/$/, "");
  const basePath = siteConfig.basePath.replace(/\/$/, "");
  // SITE_URL may already include the basePath (GitHub Pages project URL).
  const root =
    basePath && configured.endsWith(basePath)
      ? configured
      : `${configured}${basePath}`;

  if (!path || path === "/") return root;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${root}${normalized}`;
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
  const pageTitle = title
    ? `${title} · ${siteConfig.name}`
    : `${siteConfig.name} · ${siteConfig.tagline}`;
  const pageDescription = description || siteConfig.description;
  const url = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl("/opengraph-image");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords?.length ? keywords : [...siteConfig.categories],
    authors: (authors || [siteConfig.author.name]).map((name) => ({ name })),
    creator: siteConfig.author.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
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
      title: pageTitle,
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
