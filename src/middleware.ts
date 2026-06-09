import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes, the (non-localized) admin panel, Next internals, static files
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
