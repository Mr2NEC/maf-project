import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uk"],
  defaultLocale: "uk",
  pathnames: {
    "/": "/",
    "/about": "/about",
    "/calendar": "/calendar",
    "/tournaments": "/tournaments",
    "/players": "/players",
    "/rating": "/rating",
    "/blog": "/blog",
    "/contacts": "/contacts",
  },
});
