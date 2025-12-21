import { prisma } from "@/app/lib/prisma";
import { decrypt } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  const result = await decrypt(token);  

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collections = await prisma.connectionUserCollection.findMany({
    where: { userId: Number(result.userId) },
    select: {
      id: true,
      progress: true,
      completed: true,
      collection: {
        select: {
          id: true,
          name: true,
          authorName: true,
          length: true,
        },
      },
    },
  });

  return NextResponse.json(collections, { status: 200 });
}

export async function POST(request: Request) {
  // const token = request.headers.get("Authorization")?.split(" ")[1];

  // const result = await decrypt(token);

  const result = { userId: 2 };

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    userId: number;
    words: { translation: string; word: string }[];
    collection: { name: string; authorName: string };
  };
  try {
    body = await request.json();
    if (body.userId !== Number(result.userId)) {
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
    await prisma.$transaction(async (tx) => {
      const newCollection = await tx.collection.create({
        data: {
          name: body.collection.name,
          authorName: body.collection.authorName,
          length: body.words.length,
          public: false,
        },
      });

      const words = await Promise.all(
        body.words.map((word) =>
          tx.word.upsert({
            where: {
              word_translation: {
                word: word.word,
                translation: word.translation,
              },
            },
            update: {},
            create: {
              word: word.word,
              translation: word.translation,
            },
          })
        )
      );

      await tx.connectionCollectionWord.createMany({
        data: words.map((w) => ({
          collectionId: newCollection.id,
          wordId: w.id,
        })),
        skipDuplicates: true,
      });

      await tx.connectionUserCollection.create({
        data: {
          userId: result.userId,
          collectionId: newCollection.id,
          completed: false,
          progress: 0,
        },
      });
    });

    return NextResponse.json(
      { message: "Collection added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
