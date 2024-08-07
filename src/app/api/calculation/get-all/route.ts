import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// This line is to maximize the request timeout limit in vercel in production
export const maxDuration = 60;

export const GET = async () => {
  try {
    const [calculationPost, calculationReply] = await Promise.all([
      prisma.calculationPost.findMany(),
      prisma.calculationReply.findMany(),
    ]);

    return NextResponse.json({
      calculationPost,
      calculationReply,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
