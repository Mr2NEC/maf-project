import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RatingTable } from "@/components/rating/rating-table";
import { PageLayout } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { request } from "@/lib/graphql/client";
import { RATING_PERIODS, parsePeriod, periodStart } from "@/lib/public/dates";
import { RatingQuery } from "@/lib/public/queries";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ period?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">) {
  const t = await getTranslations({ locale: (await params).locale, namespace: "rating-page" });
  return { title: t("title") };
}

export default async function RatingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rating-page");
  const period = parsePeriod((await searchParams).period);
  const { rating } = await request(RatingQuery, { from: periodStart(period), take: 100 });

  return (
    <PageLayout title={t("title")}>
      <nav className="mb-6 flex gap-2" aria-label={t("period")}>
        {RATING_PERIODS.map((p) => (
          <Link
            key={p}
            href={{ pathname: "/rating", query: p === "all" ? {} : { period: p } }}
            className={cn(
              "rounded-md border px-3 py-1 text-sm",
              p === period ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {t(`periods.${p}`)}
          </Link>
        ))}
      </nav>
      <RatingTable entries={rating} />
      <p className="mt-6 text-sm text-muted-foreground">{t("rules")}</p>
    </PageLayout>
  );
}
