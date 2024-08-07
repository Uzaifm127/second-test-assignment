import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// This line is to maximize the request timeout limit in vercel in production
export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { username, password } = await req.json();

    // Checking, if user exists
    const userExist = !!(await prisma.user.findFirst({
      where: {
        username,
      },
    }));

    if (userExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Storing the user on Database
    await prisma.user.create({ data: { username, password: hashedPassword } });

    return NextResponse.json({ message: "Account created successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
