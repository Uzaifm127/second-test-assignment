import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// This line is to maximize the request timeout limit in vercel in production
export const maxDuration = 60;

export const POST = () => {
  if (cookies().has("token")) {
    cookies().delete("token");
  }

  return NextResponse.json({ message: "Logout successfully" });
};
