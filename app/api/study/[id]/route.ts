import { prisma } from "@/app/lib/prisma";
import { generateTime } from "@/utils/generateNextDateReview";
import { decrypt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    token = (await cookies()).get("session")?.value;
  }

  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { wordId: number; status: "success" | "false" };
  try {
    body = await request.json();
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
      where: { userId: Number(result.userId), wordId: body.wordId },
    });

    const newStage = body.status === "success" ? word.stage + 1 : word.stage;

    await prisma.connectionWordUser.update({
      where: { id: word.id },
      data: {
        stage: newStage,
        lastStudy: new Date(),
        nextReview: generateTime(newStage),
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
