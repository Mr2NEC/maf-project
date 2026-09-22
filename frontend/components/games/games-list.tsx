import { getFormatter, getTranslations } from "next-intl/server";
import { GameStatusBadge } from "@/components/host/status-badge";
import type { UpcomingGamesQuery } from "@/gql/graphql";
import { Link } from "@/i18n/navigation";

type Game = UpcomingGamesQuery["games"][number];

/** Upcoming and running games as a list of cards. */
export async function GamesList({ games }: { games: Game[] }) {
  const t = await getTranslations("games");
  const format = await getFormatter();

  if (games.length === 0) {
    return <p className="text-muted-foreground">{t("no-upcoming")}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {games.map((game) => {
        const free = game.gameType.playersCount - game.players.length;
        return (
          <li key={game.id}>
            <Link
              href={{ pathname: "/games/[id]", params: { id: game.id } }}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4 hover:bg-muted/50"
            >
              <span className="flex flex-col">
                <span className="font-medium">
                  {format.dateTime(new Date(game.startDate), {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-sm text-muted-foreground">{game.gameType.name}</span>
              </span>
              <span className="flex items-center gap-3 text-sm">
                {game.status === "WAITING" && (
                  <span className="text-muted-foreground">
                    {free > 0 ? t("free-seats", { count: free }) : t("full")}
                  </span>
                )}
                <GameStatusBadge status={game.status} phase={game.phase} round={game.currentRound} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
