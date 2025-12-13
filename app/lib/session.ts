import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/utils/jwt";

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = await decrypt(token);

  if (!payload?.userId) throw new Error("Unauthorized");
  return payload;
}

export async function refreshAccessToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh")?.value;


  const refreshPayload = await decrypt(refreshToken);
  if (!refreshPayload) {
    throw new Error("Session expired");
  }

  const { accessToken: newAccessToken } = await encrypt({
    userId: refreshPayload.userId,
  });

  cookieStore.set("session", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
  });

  return newAccessToken;
}
