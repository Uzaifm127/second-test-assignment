import { prisma } from "@/lib/prisma";
import { ReplyInfo } from "@/types";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// This line is to maximize the request timeout limit in vercel in production
export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { calculation, result, postId, owner, replyTo }: ReplyInfo =
      await req.json();

    await prisma.calculationReply.create({
      data: {
        replyTo,
        replyOwner: owner,
        postId,
        calculation,
        result,
      },
    });

    revalidatePath("/");

    return NextResponse.json({ message: "Responded successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
