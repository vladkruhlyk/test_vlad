import { NextResponse } from "next/server";
import { z } from "zod";
import { recommendProducts, wizardSchema } from "@/lib/recommend";

const schema = z.object({
  answers: wizardSchema,
  email: z.string().email().optional(),
});

/**
 * Recommendation wizard. Computes the top matches from static data and returns
 * them. No database — wire lead capture to your CRM / CMS when ready.
 */
export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }
    const recommendations = await recommendProducts(parsed.data.answers, 3);
    // TODO: forward { email, answers, recommendations } to your CRM.
    return NextResponse.json({ recommendations });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
