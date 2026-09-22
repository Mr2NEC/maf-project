import { notFound } from "next/navigation";
import { Locale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
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
import { GraphQLRequestError, request } from "@/lib/graphql/client";
import { PlayerProfileQuery } from "@/lib/public/queries";

type Props = { params: Promise<{ locale: Locale; id: string }> };

async function loadProfile(id: string) {
  const userId = Number(id);
  if (!Number.isInteger(userId)) {
    notFound();
  }
  try {
    return await request(PlayerProfileQuery, { id: userId });
  } catch (error) {
    if (error instanceof GraphQLRequestError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { user } = await loadProfile(id);
  return { title: user.username };
}

export default async function PlayerPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("player-page");
  const tGame = await getTranslations("game");
  const format = await getFormatter();
  const { user, players } = await loadProfile(id);

  const finished = players.filter((p) => p.game.status === "FINISHED");
  const wins = finished.filter((p) => p.role && p.role.team === p.game.winnerTeam).length;
  const points = finished.reduce((sum, p) => sum + p.points, 0);
  const fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ");

  const stats = [
    { label: t("games"), value: format.number(finished.length) },
    { label: t("wins"), value: format.number(wins) },
    { label: t("points"), value: format.number(points) },
    {
      label: t("win-rate"),
      value: finished.length
        ? format.number(wins / finished.length, { style: "percent", maximumFractionDigits: 0 })
        : "—",
    },
  ];

  return (
    <PageLayout title={user.username}>
      <div className="mb-6 flex flex-col gap-1 text-muted-foreground">
        {fullName && <span>{fullName}</span>}
        {user.club && <span>{user.club.title}</span>}
        <span>
          {t("member-since", {
            date: format.dateTime(new Date(user.createdAt), { dateStyle: "long" }),
          })}
        </span>
        {user.socials.length > 0 && (
          <span className="flex flex-wrap gap-3">
            {user.socials.map((social) => (
              <a key={social.link} href={social.link} target="_blank" rel="noopener noreferrer nofollow" className="underline">
                {social.type}
              </a>
            ))}
          </span>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{stat.value}</CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 text-xl font-semibold">{t("history")}</h2>
      {players.length === 0 ? (
        <p className="text-muted-foreground">{t("no-games")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("game")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("result")}</TableHead>
              <TableHead className="text-right">{t("points")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((p) => {
              const won = p.role && p.game.winnerTeam && p.role.team === p.game.winnerTeam;
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link href={{ pathname: "/games/[id]", params: { id: p.game.id } }} className="hover:underline">
                      {format.dateTime(new Date(p.game.startDate), { dateStyle: "medium" })}
                    </Link>
                  </TableCell>
                  <TableCell>{p.game.gameType.name}</TableCell>
                  <TableCell>{p.role ? p.role.name : "—"}</TableCell>
                  <TableCell>
                    {p.game.status === "FINISHED" ? (
                      <Badge variant={won ? "default" : "outline"}>{won ? t("won") : t("lost")}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">{tGame(`status.${p.game.status}`)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {p.game.status === "FINISHED" ? format.number(p.points) : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
}
