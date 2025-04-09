import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";

import { routing } from "@/i18n/routing";
import { BaseLayout } from "@/components/shared";
import { Locale } from "@/i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: Locale };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, "children">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "locale-layout" });

  return {
    title: t("title"),
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          href: "/favicon.ico",
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
