import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  locale: z.enum(["pl", "en", "uk"]).default("pl"),
});

/**
 * Newsletter signup. Content is managed statically (Sanity later), so there's
 * no database write here — validate the email and acknowledge. Wire this to
 * your ESP / CMS webhook when ready.
 */
export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    // TODO: forward parsed.data to your email provider / CMS.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
