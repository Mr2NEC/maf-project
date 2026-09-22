import { MetadataRoute } from "next";
import { Locale } from "next-intl";
import { host } from "@/config";
import { APP_HEADER_LINKS } from "@/constants";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Href = Parameters<typeof getPathname>[0]["href"];

export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs: Href[] = ["/", ...APP_HEADER_LINKS.map((link) => link.href)];
  return hrefs.flatMap(getEntries);
}

function getEntries(href: Href) {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)])
      ),
    },
  }));
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return host + pathname;
}
