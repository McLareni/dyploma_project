import { prisma } from "@/app/lib/prisma";
import { decrypt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.headers.get("Authorization")?.split(" ")[1];

  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collection = await prisma.collection.findFirstOrThrow({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        authorName: true,
        words: {
          select: {
            word: {
              select: {
                id: true,
                word: true,
                translation: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Collection with id ${id} not found` },
      { status: 404 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = (await cookies()).get("session")?.value;

  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { progress: number };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(JSON.stringify({ message: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const collection = await prisma.connectionUserCollection.findFirstOrThrow({
      where: { userId: Number(result.userId), collectionId: Number(id) },
      include: {
        collection: true,
      },
    });

    await prisma.connectionUserCollection.update({
      where: { id: collection.id },
      data: {
        progress: body.progress,
        completed: collection.collection.length == body.progress,
      },
    });

    return new Response(JSON.stringify({ message: "Progress changed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
