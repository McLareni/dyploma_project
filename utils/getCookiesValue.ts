import { cookies } from "next/headers";

export async function getValue(key: string) {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get(key)?.value;
  return sessionToken;
}
