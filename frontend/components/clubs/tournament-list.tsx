import { getFormatter, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui";
import type { TournamentStatus } from "@/gql/graphql";
import { Link } from "@/i18n/navigation";

type Tournament = {
  id: string;
  name: string;
  status: TournamentStatus;
  startDate: string;
  endDate?: string | null;
  club?: { title: string } | null;
};

export async function TournamentList({ tournaments }: { tournaments: Tournament[] }) {
  const t = await getTranslations("tournaments");
  const format = await getFormatter();

  if (tournaments.length === 0) {
    return <p className="text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tournaments.map((tournament) => (
        <li key={tournament.id}>
          <Link
            href={{ pathname: "/tournaments/[id]", params: { id: tournament.id } }}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4 hover:bg-muted/50"
          >
            <span className="flex flex-col">
              <span className="font-medium">{tournament.name}</span>
              <span className="text-sm text-muted-foreground">
                {[
                  tournament.club?.title,
                  format.dateTimeRange(
                    new Date(tournament.startDate),
                    new Date(tournament.endDate ?? tournament.startDate),
                    { dateStyle: "medium" }
                  ),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </span>
            <Badge variant={tournament.status === "ACTIVE" ? "default" : "secondary"}>
              {t(`status.${tournament.status}`)}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
