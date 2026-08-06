import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createPostFile } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

export const runtime = "nodejs";

const schema = z.object({
  publishKey: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(20).max(320),
  content: z.string().min(50),
  category: z.string().min(2),
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).optional(),
  coverImage: z.string().min(1),
  coverAlt: z.string().min(1),
  canonical: z.string().url().optional().or(z.literal("")).optional(),
  slug: z.string().optional(),
  draft: z.boolean().optional(),
  author: z.string().optional(),
});

function expectedKey() {
  return process.env.PUBLISH_KEY || "autothinkers";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    if (parsed.publishKey !== expectedKey()) {
      return NextResponse.json({ error: "Invalid publish key" }, { status: 401 });
    }

    const { slug } = createPostFile({
      title: parsed.title,
      description: parsed.description,
      content: parsed.content,
      category: parsed.category,
      tags: parsed.tags,
      keywords: parsed.keywords,
      coverImage: parsed.coverImage,
      coverAlt: parsed.coverAlt,
      canonical: parsed.canonical || undefined,
      slug: parsed.slug,
      draft: parsed.draft,
      author: parsed.author,
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/rss.xml");

    return NextResponse.json({
      ok: true,
      slug,
      url: absoluteUrl(`/blog/${slug}`),
    });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues.map((i) => i.message).join(", ")
        : error instanceof Error
          ? error.message
          : "Failed to publish";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
