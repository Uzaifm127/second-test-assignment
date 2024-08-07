import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// This line is to maximize the request timeout limit in vercel in production
export const maxDuration = 60;

export const GET = () => {
  try {
    const token = cookies().get("token");

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        username: "",
        userId: "",
      });
    } else {
      const { value } = token;

      if (!process.env.JWT_SECRET) {
        return NextResponse.json(
          {
            message: "JWT_SECRET not provided",
          },
          { status: 400 }
        );
      }

      const payload = jwt.verify(value, process.env.JWT_SECRET);

      const { username, userId } = payload as {
        username: string;
        userId: string;
      };

      return NextResponse.json({
        authenticated: true,
        username,
        userId,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 }
    );
  }
};
