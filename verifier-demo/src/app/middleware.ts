import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const sessionToken = request.headers
    .get("cookie")
    ?.match(/session_token=([^;]+)/)?.[1];

  if (!sessionToken) {
    return NextResponse.redirect("/signin"); // Redirect to sign-in if no session
  }

  return NextResponse.next(); // Proceed if session is valid
}
