import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  if (pathname === "/page") {
    return NextResponse.redirect("/page/1");
  }
  return NextResponse.next();
}
