import { prisma } from "@/app/lib/prisma";
import { generateTime } from "@/utils/generateNextDateReview";
import { decrypt } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.headers.get("Authorization")?.split(" ")[1];
  //   const result = await decrypt(token);

  //   if (!result) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  const result = { userId: 2 };

  let body: { userId: number; wordId: number; stage: number };
  try {
    body = await request.json();
    if (body.userId !== Number(result.userId)) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (Number(id) !== body.wordId) {
      return new Response(JSON.stringify({ message: "Word ID mismatch" }), {
        status: 400,
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
    const word = await prisma.connectionWordUser.findFirstOrThrow({
      where: { userId: body.userId, wordId: body.wordId },
    });

    await prisma.connectionWordUser.update({
      where: { id: word.id },
      data: {
        stage: body.stage,
        lastStudy: new Date(),
        nextReview: generateTime(body.stage),
      },
    });

    return new Response(
      JSON.stringify({ message: "Time of next review changed" }),
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
