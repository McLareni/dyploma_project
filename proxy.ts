import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken, verifySession } from "./app/lib/session";

const protectedRoutes = ["/profile", "/", "/collections"];
const publicRoutes = ["/auth/login", "/auth/signup"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  let userId: string | undefined;
  try {
    const session = await verifySession();
    userId = session?.userId;
  } catch {
    await refreshAccessToken();
    const session = await verifySession();
    userId = session?.userId;
  }

  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  if (isPublicRoute && userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
