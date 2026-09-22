import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GamesList } from "@/components/games/games-list";
import { PageLayout } from "@/components/shared";
import { request } from "@/lib/graphql/client";
import { startOfToday } from "@/lib/public/dates";
import { UpcomingGamesQuery } from "@/lib/public/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const t = await getTranslations({ locale: (await params).locale, namespace: "calendar-page" });
  return { title: t("title") };
}

export default async function CalendarPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("calendar-page");
  const { games } = await request(UpcomingGamesQuery, { from: startOfToday(), take: 50 });

  return (
    <PageLayout title={t("title")}>
      <p className="mb-6 text-muted-foreground">{t("description")}</p>
      <GamesList games={games} />
    </PageLayout>
  );
}
