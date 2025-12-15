import { prisma } from "@/app/lib/prisma";
import { decrypt } from "@/utils/jwt";
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
