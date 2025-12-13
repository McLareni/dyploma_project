import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface RegistrationDTO {
  email: string;
  username: string;
  password: string;
  repassword: string;
}

export async function POST(request: Request) {
  const { password, email, username, repassword }: RegistrationDTO =
    await request.json();

  if (!email || !password || !username || !repassword) {
    return NextResponse.json({ error: "Invalid post data" }, { status: 400 });
  }

  if (password !== repassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return NextResponse.json(
      { error: "User already created" },
      { status: 409 }
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      hashPassword,
    },
  });

  return NextResponse.json(
    { message: "User created", id: newUser.id },
    { status: 201 }
  );
}
