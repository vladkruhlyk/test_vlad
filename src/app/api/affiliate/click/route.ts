import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  linkId: z.string().min(1),
  productSlug: z.string().optional(),
});

/**
 * Outbound affiliate click beacon. No database — acknowledge fast and never
 * block navigation. Forward to your analytics provider when ready.
 */
export async function POST(req: Request) {
  try {
    const text = await req.text();
    schema.safeParse(JSON.parse(text || "{}"));
    // TODO: forward the click event to analytics (e.g. GA4, PostHog).
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
