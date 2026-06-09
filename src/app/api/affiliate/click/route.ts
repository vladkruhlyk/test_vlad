import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  linkId: z.string().min(1),
  productSlug: z.string().optional(),
});

/**
 * Records an outbound affiliate click. Called via navigator.sendBeacon, so it
 * must respond fast and never block. Increments the click counter atomically.
 */
export async function POST(req: Request) {
  try {
    const text = await req.text();
    const parsed = schema.safeParse(JSON.parse(text || "{}"));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.affiliateLink.update({
      where: { id: parsed.data.linkId },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Swallow errors — tracking must never surface to the user.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
