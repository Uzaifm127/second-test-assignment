import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// This line is to maximize the request timeout limit in vercel in production
export const maxDuration = 60;

export const GET = async (req: NextRequest) => {
  try {
    // We don't need to check the authentication here but I'm doing because of Next js default caching behaviour in production which is giving me 304 otherwise.
    const token = req.cookies.get("token");

    if (!token) {
      // Don't do something here
    }

    const [calculationPost, calculationReply] = await Promise.all([
      prisma.calculationPost.findMany(),
      prisma.calculationReply.findMany(),
    ]);

    return NextResponse.json({
      calculationPost,
      calculationReply,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
