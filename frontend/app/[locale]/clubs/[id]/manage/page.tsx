import { notFound } from "next/navigation";
import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClubInfoForm, CreateTournamentForm, RatingRulesForm } from "@/components/clubs/club-forms";
import { MembersManager } from "@/components/clubs/members-manager";
import { PageLayout } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Link, redirect } from "@/i18n/navigation";
import { requireUser } from "@/lib/auth/guards";
import { hasClubRole } from "@/lib/auth/session";
import { createTournament, updateClub, updateRatingRules } from "@/lib/clubs/actions";
import { ClubManageQuery } from "@/lib/clubs/queries";
import { GraphQLRequestError, request } from "@/lib/graphql/client";

type Props = { params: Promise<{ locale: Locale; id: string }> };

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: (await params).locale, namespace: "club-manage" });
  return { title: t("title") };
}

/** Club settings for club admins: info, rating rules, members, tournaments. */
export default async function ClubManagePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const clubId = Number(id);
  if (!Number.isInteger(clubId)) {
    notFound();
  }
  const user = await requireUser();
  if (!hasClubRole(user, clubId, "ADMIN")) {
    redirect({ href: { pathname: "/clubs/[id]", params: { id } }, locale });
  }

  const t = await getTranslations("club-manage");
  let data;
  try {
    data = await request(ClubManageQuery, { id: clubId, clubId });
  } catch (error) {
    if (error instanceof GraphQLRequestError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
  const { club, members, pending } = data;

  return (
    <PageLayout
      title={
        <Link href={{ pathname: "/clubs/[id]", params: { id } }} className="hover:underline">
          {club.title}
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("members-title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <MembersManager members={members} pending={pending} />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("rating-rules")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingRulesForm action={updateRatingRules.bind(null, clubId)} rules={club.ratingRules} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("new-tournament")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateTournamentForm action={createTournament.bind(null, clubId)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("club-info")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ClubInfoForm action={updateClub.bind(null, clubId)} club={club} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
