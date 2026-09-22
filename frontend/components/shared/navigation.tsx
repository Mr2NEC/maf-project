import { useTranslations } from "next-intl";
import { APP_HEADER_LINKS } from "@/constants";
import { HeaderLogo } from "./header-logo";
import { LocaleSwitcher } from "./locale-switcher";
import { ModeToggle } from "./mode-toggle";
import { NavigationLink } from "./navigation-link";
import { UserMenu } from "./user-menu";

export default function Navigation() {
  const t = useTranslations("navigation");

  return (
    <div className="flex justify-center border-b-2">
      <nav className="container flex flex-wrap items-center justify-between gap-2 p-2">
        <HeaderLogo />
        <div className="flex flex-wrap items-center gap-1">
          {APP_HEADER_LINKS.map((link) => (
            <NavigationLink key={link.name} href={link.href}>
              {t(link.name)}
            </NavigationLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <UserMenu />
          <ModeToggle />
          <LocaleSwitcher />
        </div>
      </nav>
    </div>
  );
}
