"use server";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import {
  LoginFormSchema,
  LoginFormState,
  RegistationFormSchema,
  RegistationFormState,
} from "../lib/schemes/auth";

const URL = process.env.PUBLIC_HOST;

export async function login(state: LoginFormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const res = await fetch(URL + "/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.status === 200) {
    const cookieStore = await cookies();
    cookieStore.set("session", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
    });
    cookieStore.set("refresh", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    redirect("/profile");
  }
}

export async function registration(
  state: RegistationFormState,
  formData: FormData
) {
  const validatedFields = RegistationFormSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    repassword: formData.get("repassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, username, password, repassword } = validatedFields.data;

  try {
    const res = await fetch(URL + "/api/auth/registr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, repassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }

    redirect("/auth/login");
  } catch (error) {
    return {
      message: (error as Error).message,
    };
  }
}
