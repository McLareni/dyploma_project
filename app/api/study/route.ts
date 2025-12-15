import { prisma } from "@/app/lib/prisma";
import { decrypt } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

    const result = await decrypt(token);

    if (!result) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const collection = await prisma.connectionWordUser.findMany({
    where: { userId: Number(result.userId) },
    select: {
      word: {
        select: {
          id: true,
          word: true,
          translation: true,
        },
      },
    },
  });

  return NextResponse.json(collection, { status: 200 });
}

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { userId: number; wordId: number };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(JSON.stringify({ message: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (body.userId !== Number(result.userId)) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const newWord = await prisma.connectionWordUser.create({
      data: {
        userId: body.userId,
        wordId: body.wordId,
        stage: 0,
        lastStudy: new Date(),
        nextReview: new Date(),
      },
    });

    return new Response(
      JSON.stringify({ newWord: { ...newWord }, message: "Word added" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
