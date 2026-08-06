import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div>
          <p className="font-display text-2xl text-ink">{siteConfig.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            {siteConfig.description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">
              Explore
            </p>
            <Link href="/blog" className="block text-ink/80 hover:text-ink">
              Journal
            </Link>
            <Link href="/about" className="block text-ink/80 hover:text-ink">
              About
            </Link>
            <Link href="/admin" className="block text-ink/80 hover:text-ink">
              Publish
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">
              SEO & feeds
            </p>
            <Link href="/sitemap.xml" className="block text-ink/80 hover:text-ink">
              Sitemap
            </Link>
            <Link href="/robots.txt" className="block text-ink/80 hover:text-ink">
              Robots
            </Link>
            <Link href="/rss.xml" className="block text-ink/80 hover:text-ink">
              RSS
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-4 text-center text-xs text-muted md:px-8">
        © {new Date().getFullYear()} {siteConfig.name}. Built for independent
        thinkers.
      </div>
    </footer>
  );
}
