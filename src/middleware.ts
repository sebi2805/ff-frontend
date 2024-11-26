// middleware.ts
import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access-token")?.value;

  if (!accessToken && pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // lets make an exception here for the middleware
    // bcs I need to extract the cookies on the server and I dont want to alter the axios only for 1 instance
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}api/Users/get-role`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userRole = response.data as string;
    if (pathname.startsWith("/home/admin") && userRole !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware authentication error:", error);

    if (pathname.startsWith("/home")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/home/admin/:path*"],
};
