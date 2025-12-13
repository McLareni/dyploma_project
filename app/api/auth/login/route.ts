import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { encrypt } from "@/utils/jwt";

interface LoginDTO {
  email: string;
  username: string;
  password: string;
  repassword: string;
}

const secretKey = process.env.SESSION_SECRET || "default_secret";
const encodedKey = new TextEncoder().encode(secretKey);

export async function POST(request: Request) {
  const { password, email }: LoginDTO = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Invalid post data" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user === null) {
      throw new Error("User not found");
    }

    const { id, email: userEmail, username, hashPassword, createdAt } = user;

    const isValid = await bcrypt.compare(password, hashPassword);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = await encrypt({
      userId: id.toString(),
    });

    return NextResponse.json(
      {
        user: {
          id,
          email: userEmail,
          username,
          createdAt,
        },
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "User with this email does not exist" },
      { status: 404 }
    );
  }
}
