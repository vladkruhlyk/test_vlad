import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const parsed = contactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    // Store contact messages as leads with a dedicated source.
    await prisma.lead.create({
      data: {
        email: parsed.data.email,
        source: "contact",
        answers: { name: parsed.data.name, message: parsed.data.message },
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
