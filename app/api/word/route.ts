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
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const wordFilter = searchParams.get("word")?.trim();
    const translationFilter = searchParams.get("translation")?.trim();
    const query = searchParams.get("query")?.trim();

    const wordConditions: any[] = [];

    if (query) {
      wordConditions.push({
        OR: [
          { word: { contains: query, mode: "insensitive" as const } },
          { translation: { contains: query, mode: "insensitive" as const } },
        ],
      });
    }

    if (wordFilter) {
      wordConditions.push({
        word: { contains: wordFilter, mode: "insensitive" as const },
      });
    }

    if (translationFilter) {
      wordConditions.push({
        translation: {
          contains: translationFilter,
          mode: "insensitive" as const,
        },
      });
    }

    const where = {
      userId: Number(result.userId),
      ...(wordConditions.length > 0 ? { word: { AND: wordConditions } } : {}),
    };

    const total = await prisma.connectionWordUser.count({ where });

    const userWords = await prisma.connectionWordUser.findMany({
      where,
      include: {
        word: true,
      },
      orderBy: {
        lastStudy: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const words = userWords.map((connection) => ({
      id: connection.word.id,
      word: connection.word.word,
      translation: connection.word.translation,
      stage: connection.stage,
      lastStudy: connection.lastStudy,
      nextReview: connection.nextReview,
    }));

    return NextResponse.json(
      {
        words,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
    const existingWord = await prisma.word.findFirst({
      where: {
        word: body.word.word,
        translation: body.word.translation,
      },
    });

    if (existingWord) {
      return NextResponse.json(
        { message: "Word already exists", wordId: existingWord.id },
        { status: 200 }
      );
    }

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

export async function DELETE(request: Request) {
  const token =
    request.headers.get("Authorization")?.split(" ")[1] ||
    (await cookies()).get("session")?.value;

  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { wordId: number };
  try {
    body = await request.json();
    if (!body.wordId) {
      return NextResponse.json({ error: "Missing wordId" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const connection = await prisma.connectionWordUser.findUnique({
      where: {
        wordId_userId: {
          wordId: body.wordId,
          userId: Number(result.userId),
        },
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Word not found or you don't have access to it" },
        { status: 404 }
      );
    }

    await prisma.connectionWordUser.delete({
      where: {
        wordId_userId: {
          wordId: body.wordId,
          userId: Number(result.userId),
        },
      },
    });

    return NextResponse.json(
      { message: "Word deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
