import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";

export async function GET() {
  const { user } = await validateRequest();
  
  return NextResponse.json({
    authenticated: !!user,
    user: user ? { email: user.email } : null,
  });
}

