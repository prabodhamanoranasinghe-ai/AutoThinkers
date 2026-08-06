import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const basePath = siteConfig.basePath.replace(/\/$/, "") || "";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [`${basePath}/admin`, `${basePath}/api/`].filter(Boolean),
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
