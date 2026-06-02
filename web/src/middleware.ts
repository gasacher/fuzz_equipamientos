import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getAuthSecret } from "@/lib/env";

const COOKIE = "fuzz_session";
const secret = getAuthSecret();

async function getPayload(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/cliente" || pathname === "/cliente/") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/cliente/")) {
    const id = pathname.replace("/cliente/", "");
    return NextResponse.redirect(new URL(`/equipo?id=${encodeURIComponent(id)}`, request.url));
  }

  const payload = await getPayload(request);

  if (pathname.startsWith("/login")) {
    if (payload?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/cliente", "/cliente/:path*"],
};
