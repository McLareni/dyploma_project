import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt } from "@/utils/jwt";

export async function GET() {
  const token = (await cookies()).get("session")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await decrypt(token);
  
  return NextResponse.json({ user });
}
