import { prisma } from "@/app/lib/prisma";
import { decrypt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token =
    request.headers.get("Authorization")?.split(" ")[1] ||
    (await cookies()).get("session")?.value;

  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    userId: number;
    word: { translation: string; word: string };
  };
  try {
    body = await request.json();
    if (Number(body.userId) !== Number(result.userId)) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    return new NextResponse(JSON.stringify({ message: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const word = await prisma.word.create({
      data: { word: body.word.word, translation: body.word.translation },
    });

    return NextResponse.json(
      { message: "Word added successfully", wordId: word.id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
