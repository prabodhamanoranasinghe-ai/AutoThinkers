import { AdminPublisher } from "@/components/AdminPublisher";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Publish",
  description:
    "Generate and publish AutoThinkers essays from a topic or link, with SEO fields and cover image uploads.",
  path: "/admin",
});

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Publish</p>
      <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
        Write from a topic or link
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Generate a detailed draft, tune SEO metadata, attach a cover image, and
        publish to the journal.
      </p>
      <div className="mt-10">
        <AdminPublisher />
      </div>
    </div>
  );
}
