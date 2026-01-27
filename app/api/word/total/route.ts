import { prisma } from "@/app/lib/prisma";
import { decrypt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token =
    request.headers.get("Authorization")?.split(" ")[1] ||
    (await cookies()).get("session")?.value;

  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const total = await prisma.connectionWordUser.count({
      where: { userId: Number(result.userId) },
    });

    return NextResponse.json({ total }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
