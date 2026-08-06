import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generateFromLinkMeta,
  generateFromTopic,
} from "@/lib/generate-draft";

export const runtime = "nodejs";

const schema = z.object({
  mode: z.enum(["topic", "link"]),
  source: z.string().min(3),
});

function extractMeta(html: string) {
  const title =
    html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ||
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
    "";
  const description =
    html.match(
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ||
    html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ||
    "";
  const image =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] || "";
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1800);

  return { title, description, image, text };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode, source } = schema.parse(body);
    const trimmed = source.trim();

    if (mode === "topic") {
      return NextResponse.json(generateFromTopic(trimmed));
    }

    let url: URL;
    try {
      url = new URL(trimmed);
    } catch {
      return NextResponse.json({ error: "Provide a valid URL" }, { status: 400 });
    }

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "AutoThinkersBot/1.0 (+https://autothinkers.dev)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch link (${res.status})` },
        { status: 400 },
      );
    }

    const html = await res.text();
    const meta = extractMeta(html);
    return NextResponse.json(
      generateFromLinkMeta({
        url: url.toString(),
        title: meta.title,
        description: meta.description,
        image: meta.image,
        text: meta.text,
      }),
    );
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues.map((i) => i.message).join(", ")
        : error instanceof Error
          ? error.message
          : "Generate failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
