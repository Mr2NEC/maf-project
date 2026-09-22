import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RatingRulesSummary } from "@/components/clubs/rating-rules-summary";
import { RatingTable } from "@/components/rating/rating-table";
import { PageLayout } from "@/components/shared";
import { Button, Select } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { ClubsQuery } from "@/lib/clubs/queries";
import { request } from "@/lib/graphql/client";
import { RATING_PERIODS, parsePeriod, periodStart } from "@/lib/public/dates";
import { RatingQuery } from "@/lib/public/queries";
import { graphql } from "@/gql";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ period?: string; club?: string }>;
};

const ClubRulesQuery = graphql(`
  query ClubRules($id: Int!) {
    club(id: $id) {
      title
      ratingRules {
        townWinPoints
        mafiaWinPoints
        neutralWinPoints
        lossPoints
        bonusEnabled
        minGames
      }
    }
  }
`);

export async function generateMetadata({ params }: Pick<Props, "params">) {
  const t = await getTranslations({ locale: (await params).locale, namespace: "rating-page" });
  return { title: t("title") };
}

export default async function RatingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rating-page");
  const query = await searchParams;
  const period = parsePeriod(query.period);
  const { clubs } = await request(ClubsQuery, { search: null });
  const clubId = clubs.some((club) => club.id === query.club) ? Number(query.club) : undefined;

  const [{ rating }, rules] = await Promise.all([
    request(RatingQuery, { from: periodStart(period), take: 100, clubId }),
    clubId ? request(ClubRulesQuery, { id: clubId }) : null,
  ]);

  return (
    <PageLayout title={t("title")}>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <nav className="flex gap-2" aria-label={t("period")}>
          {RATING_PERIODS.map((p) => (
            <Link
              key={p}
              href={{
                pathname: "/rating",
                query: { ...(p !== "all" && { period: p }), ...(clubId && { club: clubId }) },
              }}
              className={cn(
                "rounded-md border px-3 py-1 text-sm",
                p === period ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              {t(`periods.${p}`)}
            </Link>
          ))}
        </nav>
        {/* Plain GET form: works without JavaScript */}
        <form className="flex gap-2">
          {period !== "all" && <input type="hidden" name="period" value={period} />}
          <Select name="club" defaultValue={clubId ?? ""} aria-label={t("club")} className="w-56">
            <option value="">{t("all-clubs")}</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.title}
              </option>
            ))}
          </Select>
          <Button type="submit" variant="outline">
            {t("show")}
          </Button>
        </form>
      </div>
      <RatingTable entries={rating} />
      <div className="mt-6">
        {rules ? (
          <RatingRulesSummary rules={rules.club.ratingRules} />
        ) : (
          <p className="text-sm text-muted-foreground">{t("rules")}</p>
        )}
      </div>
    </PageLayout>
  );
}
