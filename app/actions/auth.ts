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

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const rawData = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const validatedFields = LoginFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      values: {
        email: rawData.email,
        password: rawData.password,
      },
    };
  }

  const { email, password } = validatedFields.data;

  const res = await fetch(URL + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      message: data.error ?? "Invalid credentials",
      values: { email, password },
    };
  }

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

export async function registration(
  state: RegistationFormState,
  formData: FormData
): Promise<RegistationFormState> {
  const rawData = {
    email: formData.get("email")?.toString() ?? "",
    username: formData.get("username")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    repassword: formData.get("repassword")?.toString() ?? "",
  };

  const validatedFields = RegistationFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      values: {
        email: rawData.email,
        username: rawData.username,
        password: rawData.password,
        repassword: rawData.repassword,
      },
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
      return {
        message: data.error,
        values: { email, username, password, repassword },
      };
    }
  } catch (error) {
    return {
      message: (error as Error).message,
      values: { email, username, password, repassword },
    };
  }

  redirect("/auth/login");
}


export async function logOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("refresh");

  redirect("/auth/login");
}