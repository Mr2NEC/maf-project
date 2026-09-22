import { Locale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { CreateGameForm } from "@/components/host/create-game-form";
import { GameStatusBadge } from "@/components/host/status-badge";
import { PageLayout } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { requireHost } from "@/lib/auth/guards";
import { request } from "@/lib/graphql/client";
import { HostGamesQuery } from "@/lib/host/queries";

export default async function HostPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireHost();

  const t = await getTranslations("host");
  const tGame = await getTranslations("game");
  const format = await getFormatter();
  const { active, finished, gameTypes } = await request(HostGamesQuery);

  return (
    <PageLayout title={t("title")}>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("active-games")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {active.length === 0 && <p className="text-muted-foreground">{t("no-active-games")}</p>}
            {active.map((game) => (
              <Link
                key={game.id}
                href={{ pathname: "/host/games/[id]", params: { id: game.id } }}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 hover:bg-muted/50"
              >
                <span className="font-medium">
                  {game.gameType.name} · {format.dateTime(new Date(game.startDate), { dateStyle: "medium", timeStyle: "short" })}
                </span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {t("seated", { count: game.players.length, total: game.gameType.playersCount })}
                  <GameStatusBadge status={game.status} phase={game.phase} round={game.currentRound} />
                </span>
              </Link>
            ))}
            {finished.length > 0 && (
              <>
                <h3 className="mt-4 text-sm font-semibold text-muted-foreground">{t("recent-games")}</h3>
                {finished.map((game) => (
                  <Link
                    key={game.id}
                    href={{ pathname: "/host/games/[id]", params: { id: game.id } }}
                    className="flex justify-between rounded-md p-2 text-sm hover:bg-muted/50"
                  >
                    <span>
                      {game.gameType.name} · {format.dateTime(new Date(game.startDate), { dateStyle: "medium" })}
                    </span>
                    {game.winnerTeam && <span>{tGame(`winner.${game.winnerTeam}`)}</span>}
                  </Link>
                ))}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("new-game")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateGameForm gameTypes={gameTypes} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
