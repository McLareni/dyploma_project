import { prisma } from "@/app/lib/prisma";
import { decrypt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token =
    request.headers.get("Authorization")?.split(" ")[1] ||
    (await cookies()).get("session")?.value;

  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    const words = await prisma.connectionWordUser.findMany({
      where: {
        userId: user.id,
        stage: 6,
      },
    });

    return NextResponse.json(
      { ...user, quantityWords: words.length },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `User with id ${id} not found` },
      { status: 404 },
    );
  }
}
