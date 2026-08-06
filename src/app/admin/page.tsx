import { AdminPublisher } from "@/components/AdminPublisher";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Local draft studio",
  description:
    "Owner-only local studio for drafting AutoThinkers essays. Not included on the public site.",
  path: "/admin",
});

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">
        Local only
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
        Draft studio
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Generate essays from a topic or link on your machine. The public site
        does not link here and GitHub Pages does not ship this route.
      </p>
      <div className="mt-10">
        <AdminPublisher />
      </div>
    </div>
  );
}
