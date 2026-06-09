import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { recommendProducts, wizardSchema } from "@/lib/recommend";

const schema = z.object({
  answers: wizardSchema,
  email: z.string().email().optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }
    const { answers, email } = parsed.data;

    const recommendations = await recommendProducts(answers, 3);

    // Persist the lead + its recommendations for the affiliate funnel.
    await prisma.lead.create({
      data: {
        email,
        source: "wizard",
        answers,
        recommended: {
          create: recommendations.map((r, i) => ({ productId: r.id, rank: i })),
        },
      },
    });

    return NextResponse.json({ recommendations });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
