import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  if (pathname === "/page") {
    return NextResponse.redirect(new URL("/page/1", req.url));
  }
  return NextResponse.next();
}
