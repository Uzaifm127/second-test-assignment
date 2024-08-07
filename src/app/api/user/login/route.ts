import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// This line is to maximize the request timeout limit in vercel in production
export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { username, password } = await req.json();

    // Checking, if user exists
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 400 }
      );
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 400 }
      );
    }

    const JWTPayload = {
      username: user.username,
      userId: user.id,
    };

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        {
          message: "JWT_SECRET not provided",
        },
        { status: 400 }
      );
    }

    const token = jwt.sign(JWTPayload, process.env.JWT_SECRET);

    cookies().set("token", token, {
      httpOnly: true,
      // Expires after a month
      maxAge: 3600 * 24 * 30,
    });

    return NextResponse.json({ message: "Logged in successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
