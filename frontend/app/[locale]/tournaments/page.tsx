import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TournamentList } from "@/components/clubs/tournament-list";
import { PageLayout } from "@/components/shared";
import { request } from "@/lib/graphql/client";
import { TournamentsQuery } from "@/lib/clubs/queries";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: (await params).locale, namespace: "tournaments" });
  return { title: t("title") };
}

export default async function TournamentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tournaments");
  const [current, finished] = await Promise.all([
    request(TournamentsQuery, { statuses: ["ACTIVE", "PLANNED"] }),
    request(TournamentsQuery, { statuses: ["FINISHED"] }),
  ]);

  return (
    <PageLayout title={t("title")}>
      <p className="mb-6 text-muted-foreground">{t("lead")}</p>
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-xl font-semibold">{t("current")}</h2>
          <TournamentList tournaments={current.tournaments} />
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold">{t("finished")}</h2>
          <TournamentList tournaments={finished.tournaments} />
        </section>
      </div>
    </PageLayout>
  );
}
