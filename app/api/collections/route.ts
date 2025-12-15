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
          leghth: true,
        },
      },
    },
  });

  return NextResponse.json(collections, { status: 200 });
}
