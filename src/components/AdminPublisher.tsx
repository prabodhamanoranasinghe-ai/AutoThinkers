"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/lib/site";

type GenerateMode = "topic" | "link";

const defaultCover = "/images/covers/default.svg";

export function AdminPublisher() {
  const [mode, setMode] = useState<GenerateMode>("topic");
  const [source, setSource] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>(siteConfig.categories[0]);
  const [tags, setTags] = useState("");
  const [keywords, setKeywords] = useState("");
  const [coverImage, setCoverImage] = useState(defaultCover);
  const [coverAlt, setCoverAlt] = useState("");
  const [canonical, setCanonical] = useState("");
  const [slug, setSlug] = useState("");
  const [draft, setDraft] = useState(false);
  const [publishKey, setPublishKey] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const tagList = useMemo(
    () =>
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tags],
  );

  const keywordList = useMemo(
    () =>
      keywords
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [keywords],
  );

  async function handleGenerate() {
    setBusy(true);
    setError(null);
    setStatus(null);
    setPublishedUrl(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate draft");

      setTitle(data.title || "");
      setDescription(data.description || "");
      setContent(data.content || "");
      setCategory(data.category || siteConfig.categories[0]);
      setTags((data.tags || []).join(", "));
      setKeywords((data.keywords || data.tags || []).join(", "));
      setCoverAlt(data.coverAlt || data.title || "");
      if (data.coverImage) setCoverImage(data.coverImage);
      if (data.canonical) setCanonical(data.canonical);
      if (data.slug) setSlug(data.slug);
      setStatus("Draft generated. Review SEO fields, add an image, then publish.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generate failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("publishKey", publishKey);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCoverImage(data.url);
      if (!coverAlt) setCoverAlt(title || file.name);
      setStatus(`Image uploaded: ${data.url}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    setBusy(true);
    setError(null);
    setStatus(null);
    setPublishedUrl(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishKey,
          title,
          description,
          content,
          category,
          tags: tagList,
          keywords: keywordList.length ? keywordList : tagList,
          coverImage,
          coverAlt: coverAlt || title,
          canonical: canonical || undefined,
          slug: slug || undefined,
          draft,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setPublishedUrl(data.url);
      setStatus(draft ? "Draft saved." : "Published successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="border border-[var(--line)] bg-[rgba(255,255,255,0.45)] p-6 md:p-8">
        <h2 className="font-display text-2xl text-ink">1. Generate from topic or link</h2>
        <p className="mt-2 text-sm text-muted">
          Paste a topic idea or a source URL. AutoThinkers drafts a detailed
          Markdown essay with SEO-ready metadata.
        </p>

        <div className="mt-5 flex gap-2">
          {(["topic", "link"] as GenerateMode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`px-4 py-2 text-sm ${
                mode === item
                  ? "bg-ink text-fog"
                  : "border border-[var(--line)] text-ink/80"
              }`}
            >
              {item === "topic" ? "Topic" : "Link"}
            </button>
          ))}
        </div>

        <label className="mt-5 block">
          <span className="field-label">
            {mode === "topic" ? "Topic" : "Source URL"}
          </span>
          <input
            className="field"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder={
              mode === "topic"
                ? "e.g. How to run a weekly thinking review"
                : "https://example.com/article"
            }
          />
        </label>

        <button
          type="button"
          className="btn-primary mt-5"
          disabled={busy || !source.trim()}
          onClick={handleGenerate}
        >
          {busy ? "Working…" : "Generate draft"}
        </button>
      </section>

      <section className="border border-[var(--line)] bg-[rgba(255,255,255,0.45)] p-6 md:p-8">
        <h2 className="font-display text-2xl text-ink">2. Edit post & SEO</h2>
        <div className="mt-6 grid gap-5">
          <label>
            <span className="field-label">Title</span>
            <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <span className="field-label">Meta description</span>
            <textarea
              className="field min-h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="field-label">Category</span>
              <select
                className="field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {siteConfig.categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="field-label">Slug (optional)</span>
              <input
                className="field"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-from-title"
              />
            </label>
          </div>
          <label>
            <span className="field-label">Tags (comma-separated)</span>
            <input className="field" value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
          <label>
            <span className="field-label">SEO keywords (comma-separated)</span>
            <input
              className="field"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </label>
          <label>
            <span className="field-label">Canonical URL (optional)</span>
            <input
              className="field"
              value={canonical}
              onChange={(e) => setCanonical(e.target.value)}
              placeholder="https://yoursite.com/blog/your-slug"
            />
          </label>
          <label>
            <span className="field-label">Markdown body</span>
            <textarea
              className="field min-h-80 font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="border border-[var(--line)] bg-[rgba(255,255,255,0.45)] p-6 md:p-8">
        <h2 className="font-display text-2xl text-ink">3. Cover image</h2>
        <p className="mt-2 text-sm text-muted">
          Upload a local image or paste an image path/URL. Used for the article
          hero and Open Graph social preview.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label>
            <span className="field-label">Image URL / path</span>
            <input
              className="field"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </label>
          <label>
            <span className="field-label">Alt text</span>
            <input
              className="field"
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
            />
          </label>
        </div>
        <label className="mt-5 block">
          <span className="field-label">Upload image</span>
          <input
            className="field"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={(e) => handleUpload(e.target.files?.[0] || null)}
          />
        </label>
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={coverAlt || "Cover preview"}
            className="mt-5 max-h-56 w-full object-cover"
          />
        ) : null}
      </section>

      <section className="border border-[var(--line)] bg-[rgba(255,255,255,0.45)] p-6 md:p-8">
        <h2 className="font-display text-2xl text-ink">4. Publish</h2>
        <label className="mt-5 block">
          <span className="field-label">Publish key</span>
          <input
            className="field"
            type="password"
            value={publishKey}
            onChange={(e) => setPublishKey(e.target.value)}
            placeholder="Set PUBLISH_KEY in .env.local (default: autothinkers)"
          />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
          />
          Save as draft (hidden in production)
        </label>
        <button
          type="button"
          className="btn-primary mt-5"
          disabled={busy || !title || !content || !description}
          onClick={handlePublish}
        >
          {busy ? "Publishing…" : draft ? "Save draft" : "Publish essay"}
        </button>

        {status ? <p className="mt-4 text-sm text-sea">{status}</p> : null}
        {publishedUrl ? (
          <p className="mt-2 text-sm">
            Live at{" "}
            <a className="text-sea underline" href={publishedUrl}>
              {publishedUrl}
            </a>
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-copper-deep">{error}</p> : null}
      </section>
    </div>
  );
}
