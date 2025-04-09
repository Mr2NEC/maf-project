import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./locale-switcher";
import { NavigationLink } from "./navigation-link";
import { APP_HEADER_LINKS } from "@/constants";
import { ModeToggle } from "./mode-toggle";
import { HeaderLogo } from "./header-logo";

export default function Navigation() {
  const t = useTranslations("navigation");

  return (
    <div className="border-b-2 flex justify-center">
      <nav className="container flex justify-between p-2">
        <div className="flex items-center">
          <HeaderLogo />
        </div>
        <div className="flex items-center gap-3">
          {APP_HEADER_LINKS.map((link) => (
            <NavigationLink key={link.name} href={link.href}>
              {t(link.name)}
            </NavigationLink>
          ))}
          <ModeToggle />
          <LocaleSwitcher />
        </div>
      </nav>
    </div>
  );
}
