
import { auth } from "@/auth"
 
export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname === "/auth/login" || req.nextUrl.pathname === "/auth/signup";
  if (req.auth && isAuthPage) {
    const newUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (!req.auth && !isAuthPage) {
    const newUrl = new URL("/auth/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  }
