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
    "/players/[id]": "/players/[id]",
    "/games/[id]": "/games/[id]",
    "/rating": "/rating",
    "/blog": "/blog",
    "/contacts": "/contacts",
    "/login": "/login",
    "/register": "/register",
    "/host": "/host",
    "/host/games/[id]": "/host/games/[id]",
  },
});
