import { notFound } from "next/navigation";
import { Locale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { GameStatusBadge } from "@/components/host/status-badge";
import { PageLayout } from "@/components/shared";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { GraphQLRequestError, request } from "@/lib/graphql/client";
import { PublicGameQuery } from "@/lib/public/queries";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; id: string }> };

async function loadGame(id: string) {
  const gameId = Number(id);
  if (!Number.isInteger(gameId)) {
    notFound();
  }
  try {
    return (await request(PublicGameQuery, { id: gameId })).game;
  } catch (error) {
    if (error instanceof GraphQLRequestError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "game-page" });
  const game = await loadGame(id);
  return { title: t("title", { type: game.gameType.name }) };
}

/**
 * Public view of a game. Roles come back as null from the API while the game
 * runs, so spectators only see them after the end.
 */
export default async function GamePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("game-page");
  const tGame = await getTranslations("game");
  const format = await getFormatter();
  const game = await loadGame(id);
  const finished = game.status === "FINISHED";

  return (
    <PageLayout title={game.gameType.name}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <GameStatusBadge status={game.status} phase={game.phase} round={game.currentRound} />
        <span className="text-muted-foreground">
          {format.dateTime(new Date(game.startDate), { dateStyle: "full", timeStyle: "short" })}
        </span>
        {game.club && (
          <Link
            href={{ pathname: "/clubs/[id]", params: { id: game.club.id } }}
            className="text-muted-foreground hover:underline"
          >
            {game.club.title}
          </Link>
        )}
        {game.tournament && (
          <Link
            href={{ pathname: "/tournaments/[id]", params: { id: game.tournament.id } }}
            className="text-muted-foreground hover:underline"
          >
            {game.tournament.name}
          </Link>
        )}
      </div>

      {game.winnerTeam && (
        <p className="mb-6 text-2xl font-semibold">{tGame(`winner.${game.winnerTeam}`)}</p>
      )}

      {game.players.length === 0 ? (
        <p className="text-muted-foreground">{t("no-players")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>{t("player")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              {finished && <TableHead className="text-right">{t("points")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {game.players.map((player) => (
              <TableRow key={player.id} className={cn(player.status !== "ALIVE" && !finished && "opacity-60")}>
                <TableCell className="font-mono">{player.seatNumber}</TableCell>
                <TableCell>
                  <Link
                    href={{ pathname: "/players/[id]", params: { id: String(player.userId) } }}
                    className="font-medium hover:underline"
                  >
                    {player.username}
                  </Link>
                </TableCell>
                <TableCell>
                  {player.role ? (
                    <Badge variant={player.role.team === "MAFIA" ? "destructive" : "secondary"}>
                      {player.role.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">{t("hidden-role")}</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {tGame(`player-status.${player.status}`)}
                </TableCell>
                {finished && (
                  <TableCell className="text-right font-semibold">{format.number(player.points)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
}
