import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uk"],
  defaultLocale: "uk",
  pathnames: {
    "/": "/",
    "/about": "/about",
    "/calendar": "/calendar",
    "/tournaments": "/tournaments",
    "/tournaments/[id]": "/tournaments/[id]",
    "/clubs": "/clubs",
    "/clubs/[id]": "/clubs/[id]",
    "/clubs/[id]/manage": "/clubs/[id]/manage",
    "/players": "/players",
    "/players/[id]": "/players/[id]",
    "/games/[id]": "/games/[id]",
    "/rating": "/rating",
    "/contacts": "/contacts",
    "/login": "/login",
    "/register": "/register",
    "/host": "/host",
    "/host/games/[id]": "/host/games/[id]",
  },
});
