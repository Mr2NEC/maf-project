import { Messages } from "next-intl";
import { routing } from "@/i18n/routing";

/** Static routes only: header links have no params */
type AppPathname = Exclude<keyof typeof routing.pathnames, `${string}[${string}`>;

export const APP_HEADER_LINKS: ReadonlyArray<{
  href: AppPathname;
  name: keyof Messages["navigation"];
}> = [
  {
    href: "/about",
    name: "about",
  },
  {
    href: "/calendar",
    name: "calendar",
  },
  {
    href: "/tournaments",
    name: "tournaments",
  },
  {
    href: "/players",
    name: "players",
  },
  {
    href: "/rating",
    name: "rating",
  },
  {
    href: "/blog",
    name: "blog",
  },
  {
    href: "/contacts",
    name: "contacts",
  },
];
