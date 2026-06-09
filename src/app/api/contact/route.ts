import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";

/**
 * Contact form. No database — validate and acknowledge. Forward to your email
 * provider / CMS / inbox when ready.
 */
export async function POST(req: Request) {
  try {
    const parsed = contactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    // TODO: forward parsed.data to your inbox / CRM.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
