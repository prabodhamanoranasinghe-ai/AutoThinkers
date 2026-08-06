"use client";

import { useMemo, useState } from "react";
import {
  generateFromLinkMeta,
  generateFromTopic,
  toMarkdownFile,
  type GenerateMode,
} from "@/lib/generate-draft";
import { siteConfig } from "@/lib/site";

const defaultCover = "/images/covers/default.svg";
const isStaticHost =
  process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ||
  Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

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
  const [apiAvailable, setApiAvailable] = useState(!isStaticHost);

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

  function applyDraft(data: {
    title?: string;
    description?: string;
    content?: string;
    category?: string;
    tags?: string[];
    keywords?: string[];
    coverImage?: string;
    coverAlt?: string;
    canonical?: string;
    slug?: string;
  }) {
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
  }

  async function handleGenerate() {
    setBusy(true);
    setError(null);
    setStatus(null);
    setPublishedUrl(null);
    try {
      if (apiAvailable && !isStaticHost) {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, source }),
        });
        if (res.ok) {
          const data = await res.json();
          applyDraft(data);
          setStatus(
            "Draft generated. Review SEO fields, add an image, then publish or download.",
          );
          return;
        }
        if (res.status === 404) {
          setApiAvailable(false);
        }
      }

      if (mode === "link") {
        let parsed: URL;
        try {
          parsed = new URL(source.trim());
        } catch {
          throw new Error("Provide a valid URL");
        }
        applyDraft(
          generateFromLinkMeta({
            url: parsed.toString(),
            title: `Insights from ${parsed.hostname}`,
            description: `An AutoThinkers essay inspired by ${parsed.toString()}`,
            text: `Source link provided: ${parsed.toString()}`,
          }),
        );
        setStatus(
          "Draft generated locally from the link. Edit details, then download the Markdown file for GitHub Pages.",
        );
      } else {
        applyDraft(generateFromTopic(source));
        setStatus(
          "Draft generated. Review SEO fields, then download Markdown for GitHub Pages (or publish locally).",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generate failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file: File | null) {
    if (!file) return;
    if (isStaticHost || !apiAvailable) {
      const objectUrl = URL.createObjectURL(file);
      setCoverImage(objectUrl);
      if (!coverAlt) setCoverAlt(title || file.name);
      setStatus(
        `Previewing ${file.name}. For GitHub Pages, add the image under public/uploads and set coverImage to /uploads/your-file.jpg before committing.`,
      );
      return;
    }

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

  function handleDownloadMarkdown() {
    setError(null);
    try {
      const file = toMarkdownFile({
        title,
        description,
        content,
        category,
        tags: tagList,
        keywords: keywordList.length ? keywordList : tagList,
        coverImage: coverImage.startsWith("blob:")
          ? "/images/covers/default.svg"
          : coverImage,
        coverAlt: coverAlt || title,
        canonical: canonical || undefined,
        slug: slug || undefined,
        draft,
      });
      const blob = new Blob([file.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.filename;
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus(
        `Downloaded ${file.filename}. Commit it to content/posts/ and push — GitHub Pages will publish on the next deploy.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    }
  }

  async function handlePublish() {
    if (isStaticHost || !apiAvailable) {
      handleDownloadMarkdown();
      return;
    }

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
      <div className="border border-[var(--line)] bg-[rgba(255,255,255,0.45)] p-5 text-sm leading-relaxed text-ink-soft">
        <p className="font-medium text-ink">GitHub Pages publishing</p>
        <p className="mt-2">
          This site deploys as a static site on GitHub Pages. Generate a draft
          here, download the Markdown file, commit it to{" "}
          <code className="text-sea">content/posts/</code>, and push — Actions
          rebuilds the site automatically. Or send a topic/link in chat and we
          can commit the post for you.
        </p>
      </div>

      <section className="border border-[var(--line)] bg-[rgba(255,255,255,0.45)] p-6 md:p-8">
        <h2 className="font-display text-2xl text-ink">
          1. Generate from topic or link
        </h2>
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
            <input
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
            <input
              className="field"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
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
          Paste an image path/URL, or preview a local file. For GitHub Pages,
          commit images under <code>public/uploads/</code>.
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
          <span className="field-label">Upload / preview image</span>
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
        {!isStaticHost ? (
          <label className="mt-5 block">
            <span className="field-label">Publish key (local server only)</span>
            <input
              className="field"
              type="password"
              value={publishKey}
              onChange={(e) => setPublishKey(e.target.value)}
              placeholder="Set PUBLISH_KEY in .env.local (default: autothinkers)"
            />
          </label>
        ) : null}
        <label className="mt-4 flex items-center gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
          />
          Mark as draft in frontmatter
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            disabled={busy || !title || !content || !description}
            onClick={handleDownloadMarkdown}
          >
            Download Markdown
          </button>
          {!isStaticHost ? (
            <button
              type="button"
              className="btn-secondary"
              disabled={busy || !title || !content || !description}
              onClick={handlePublish}
            >
              {busy ? "Publishing…" : draft ? "Save draft locally" : "Publish locally"}
            </button>
          ) : null}
        </div>

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
