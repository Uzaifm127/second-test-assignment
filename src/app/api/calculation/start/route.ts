import { prisma } from "@/lib/prisma";
import { PostInfo } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// This line is to maximize the request timeout limit in vercel in production
export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { startingNumber, userId, username }: PostInfo = await req.json();

    const discussionExist = !!(await prisma.calculationPost.findFirst({
      where: {
        startingNumber,
        userId,
      },
    }));

    if (discussionExist) {
      throw new Error("Already started discussion with this number");
    }

    await prisma.calculationPost.create({
      data: {
        postOwner: username,
        userId,
        startingNumber,
      },
    });

    return NextResponse.json({ message: "Discussion started successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
