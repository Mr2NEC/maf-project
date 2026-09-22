import { notFound } from "next/navigation";
import { Locale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { MembershipButton } from "@/components/clubs/membership-button";
import { RatingRulesSummary } from "@/components/clubs/rating-rules-summary";
import { TournamentList } from "@/components/clubs/tournament-list";
import { GamesList } from "@/components/games/games-list";
import { RatingTable } from "@/components/rating/rating-table";
import { PageLayout } from "@/components/shared";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getCurrentUser, hasClubRole } from "@/lib/auth/session";
import { ClubQuery } from "@/lib/clubs/queries";
import { GraphQLRequestError, request } from "@/lib/graphql/client";
import { startOfToday } from "@/lib/public/dates";

type Props = { params: Promise<{ locale: Locale; id: string }> };

async function loadClub(id: string) {
  const clubId = Number(id);
  if (!Number.isInteger(clubId)) {
    notFound();
  }
  try {
    return await request(ClubQuery, { id: clubId, clubId, from: startOfToday() });
  } catch (error) {
    if (error instanceof GraphQLRequestError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { club } = await loadClub(id);
  return { title: club.title };
}

export default async function ClubPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("club-page");
  const tRole = await getTranslations("club-role");
  const format = await getFormatter();
  const [{ club, clubMembers, games, rating, tournaments }, user] = await Promise.all([
    loadClub(id),
    getCurrentUser(),
  ]);
  const clubId = Number(club.id);
  const membership = user?.clubs.find((m) => m.clubId === clubId) ?? null;

  return (
    <PageLayout title={club.title}>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">
            {club.region} ·{" "}
            {t("since", { date: format.dateTime(new Date(club.createdAt), { dateStyle: "long" }) })}
          </p>
          {club.description && <p className="max-w-2xl whitespace-pre-line">{club.description}</p>}
        </div>
        <div className="flex flex-wrap items-start gap-2">
          {user && <MembershipButton clubId={clubId} status={membership?.status ?? null} />}
          {hasClubRole(user, clubId, "HOST") && (
            <Button asChild variant="outline">
              <Link href="/host">{t("host-panel")}</Link>
            </Button>
          )}
          {hasClubRole(user, clubId, "ADMIN") && (
            <Button asChild variant="outline">
              <Link href={{ pathname: "/clubs/[id]/manage", params: { id: club.id } }}>{t("manage")}</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("games")}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* The club is this page: do not repeat it on every game */}
            <GamesList games={games.map((game) => ({ ...game, club: null }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("rating")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <RatingTable entries={rating} compact />
            <Link
              href={{ pathname: "/rating", query: { club: club.id } }}
              className="text-sm underline"
            >
              {t("full-rating")}
            </Link>
            <RatingRulesSummary rules={club.ratingRules} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("tournaments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <TournamentList tournaments={tournaments} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("members", { count: clubMembers.length })}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {clubMembers.map((member) => (
                <li key={member.id}>
                  <Link
                    href={{ pathname: "/players/[id]", params: { id: member.user.id } }}
                    className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-muted/50"
                  >
                    {member.user.username}
                    {member.role !== "MEMBER" && <Badge variant="secondary">{tRole(member.role)}</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
