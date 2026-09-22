import { Locale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { CreateGameForm } from "@/components/host/create-game-form";
import { GameStatusBadge } from "@/components/host/status-badge";
import { PageLayout } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { requireHost } from "@/lib/auth/guards";
import { hostedClubs, isPlatformHost } from "@/lib/auth/session";
import { request } from "@/lib/graphql/client";
import { HostGamesQuery } from "@/lib/host/queries";

export default async function HostPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireHost();

  const t = await getTranslations("host");
  const tGame = await getTranslations("game");
  const format = await getFormatter();
  const data = await request(HostGamesQuery);

  // Only games this host may run: their clubs' games, club-less ones for platform hosts
  const everything = user.role === "ADMIN";
  const clubs = hostedClubs(user);
  const clubIds = new Set(clubs.map((c) => c.clubId));
  const mine = (game: { clubId?: number | null }) =>
    everything || (game.clubId ? clubIds.has(game.clubId) : isPlatformHost(user));
  const active = data.active.filter(mine);
  const finished = data.finished.filter(mine).slice(0, 10);

  const places = [
    ...(isPlatformHost(user) ? [{ value: "", label: t("no-club") }] : []),
    ...clubs.flatMap((club) => [
      { value: `club:${club.clubId}`, label: club.title },
      ...data.tournaments
        .filter((tournament) => tournament.clubId === club.clubId)
        .map((tournament) => ({
          value: `tournament:${tournament.id}`,
          label: `${club.title} · ${tournament.name}`,
        })),
    ]),
  ];

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
                <span className="flex flex-col">
                  <span className="font-medium">
                    {game.gameType.name} · {format.dateTime(new Date(game.startDate), { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                  {game.club && (
                    <span className="text-sm text-muted-foreground">
                      {game.club.title}
                      {game.tournament && ` · ${game.tournament.name}`}
                    </span>
                  )}
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
            <CreateGameForm gameTypes={data.gameTypes} places={places} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
