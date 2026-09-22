import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GamesList } from "@/components/games/games-list";
import { RatingTable } from "@/components/rating/rating-table";
import { PageLayout } from "@/components/shared";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { request } from "@/lib/graphql/client";
import { startOfToday } from "@/lib/public/dates";
import { RatingQuery, UpcomingGamesQuery } from "@/lib/public/queries";

export default async function IndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("index-page");

  const [{ games }, { rating }] = await Promise.all([
    request(UpcomingGamesQuery, { from: startOfToday(), take: 3 }),
    request(RatingQuery, { take: 5 }),
  ]);

  return (
    <PageLayout title={t("title")}>
      <p className="mb-8 max-w-2xl text-muted-foreground">{t("lead")}</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t("next-games")}</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/calendar">{t("all-games")}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <GamesList games={games} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t("top-players")}</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/rating">{t("full-rating")}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RatingTable entries={rating} compact />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
