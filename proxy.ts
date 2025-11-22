import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const allCookies = request.cookies.getAll();

  const supabaseCookie = allCookies.find(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  const public_routes = ["/"];

  if (!supabaseCookie) {
    if (!public_routes.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  try {
    const base64Value = supabaseCookie.value.replace("base64-", "");
    const decodedJson = JSON.parse(atob(base64Value));
    const accessToken = decodedJson.access_token;

    if (!accessToken) {
      return NextResponse.next();
    }

    const payload = decodeJwt(accessToken);
    const userId = payload.sub;

    if (accessToken && public_routes.includes(pathname)) {
      if (userId) {
        return NextResponse.redirect(new URL(`/${userId}/to-do`, request.url));
      }
    }

    const protectedRoutePattern = /^\/([^\/]+)\/.+$/;
    const protectedRouteMatch = pathname.match(protectedRoutePattern);

    if (accessToken && protectedRouteMatch) {
      const routeUserId = protectedRouteMatch[1];

      if (userId && routeUserId !== userId) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (userId && routeUserId === userId) {
        return NextResponse.next();
      }
    }

    if (!accessToken && protectedRoutePattern.test(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error processing authentication:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
