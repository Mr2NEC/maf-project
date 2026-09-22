import { notFound } from "next/navigation";
import { Locale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { TournamentHostPanel } from "@/components/clubs/tournament-host-panel";
import { GamesList } from "@/components/games/games-list";
import { PageLayout } from "@/components/shared";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getCurrentUser, hasClubRole } from "@/lib/auth/session";
import { TournamentQuery } from "@/lib/clubs/queries";
import { GraphQLRequestError, request } from "@/lib/graphql/client";

type Props = { params: Promise<{ locale: Locale; id: string }> };

async function loadTournament(id: string) {
  const tournamentId = Number(id);
  if (!Number.isInteger(tournamentId)) {
    notFound();
  }
  try {
    return (await request(TournamentQuery, { id: tournamentId })).tournament;
  } catch (error) {
    if (error instanceof GraphQLRequestError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props) {
  const tournament = await loadTournament((await params).id);
  return { title: tournament.name };
}

export default async function TournamentPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tournament-page");
  const tStatus = await getTranslations("tournaments");
  const format = await getFormatter();
  const [tournament, user] = await Promise.all([loadTournament(id), getCurrentUser()]);
  const canManage = hasClubRole(user, tournament.clubId, "HOST");

  return (
    <PageLayout title={tournament.name}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant={tournament.status === "ACTIVE" ? "default" : "secondary"}>
          {tStatus(`status.${tournament.status}`)}
        </Badge>
        <Link
          href={{ pathname: "/clubs/[id]", params: { id: tournament.club.id } }}
          className="hover:underline"
        >
          {tournament.club.title}
        </Link>
        <span className="text-muted-foreground">
          {format.dateTimeRange(
            new Date(tournament.startDate),
            new Date(tournament.endDate ?? tournament.startDate),
            { dateStyle: "long" }
          )}
        </span>
      </div>
      {tournament.description && <p className="mb-6 max-w-2xl whitespace-pre-line">{tournament.description}</p>}

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("standings")}</CardTitle>
          </CardHeader>
          <CardContent>
            {tournament.standings.length === 0 ? (
              <p className="text-muted-foreground">{t("no-standings")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>{t("player")}</TableHead>
                    <TableHead className="text-right">{t("points")}</TableHead>
                    <TableHead className="text-right">{t("games")}</TableHead>
                    <TableHead className="text-right">{t("wins")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournament.standings.map((row) => (
                    <TableRow key={row.user.id}>
                      <TableCell className="font-mono">{row.place}</TableCell>
                      <TableCell>
                        <Link
                          href={{ pathname: "/players/[id]", params: { id: row.user.id } }}
                          className="font-medium hover:underline"
                        >
                          {row.user.username}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{format.number(row.points)}</TableCell>
                      <TableCell className="text-right">{row.games}</TableCell>
                      <TableCell className="text-right">{row.wins}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6">
          {canManage && (
            <Card>
              <CardHeader>
                <CardTitle>{t("manage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <TournamentHostPanel
                  tournamentId={Number(tournament.id)}
                  clubId={tournament.clubId}
                  status={tournament.status}
                  participants={tournament.participants}
                  hasGames={tournament.games.length > 0}
                />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>{t("games")}</CardTitle>
            </CardHeader>
            <CardContent>
              <GamesList games={tournament.games} empty={t("no-games")} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
