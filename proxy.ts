import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken, verifySession } from "./app/lib/session";

const protectedRoutes = ["/profile", "/", "/collections"];
const publicRoutes = ["/auth/login", "/auth/signup"];
const allowedOrigins = ["http://127.0.0.1:5173", "http://localhost:5173"];

function isAllowedOrigin(origin: string) {
  return (
    allowedOrigins.includes(origin) || origin.startsWith("chrome-extension://")
  );
}

function applyCorsHeaders(response: NextResponse, origin: string) {
  if (isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }

  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const origin = req.headers.get("origin") || "";

  if (path.startsWith("/api")) {
    if (req.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 });
      return applyCorsHeaders(response, origin);
    }

    const response = NextResponse.next();
    return applyCorsHeaders(response, origin);
  }

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
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
