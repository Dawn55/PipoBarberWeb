import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isAdmin = token?.isAdmin === true;
  const isAuthPage = 
    request.nextUrl.pathname.startsWith("/login") || 
    request.nextUrl.pathname.startsWith("/register");
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isAppointmentPage = request.nextUrl.pathname.startsWith("/appointments");
  
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  if (!isAuthenticated && (isAppointmentPage || isAdminPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  if (isAuthenticated && !isAdmin && isAdminPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/login/:path*", "/register/:path*", "/appointments/:path*", "/admin/:path*"],
};