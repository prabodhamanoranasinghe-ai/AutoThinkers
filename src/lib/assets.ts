import { siteConfig } from "@/lib/site";

/** Prefix local public assets with NEXT_PUBLIC_BASE_PATH for GitHub Pages. */
export function assetPath(path: string): string {
  if (!path) return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const base = siteConfig.basePath.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
