import { notFound } from "next/navigation";
import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GameControl } from "@/components/host/game-control";
import { PageLayout } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { requireHost } from "@/lib/auth/guards";
import { GraphQLRequestError, request } from "@/lib/graphql/client";
import { HostGameQuery, NightActionsQuery } from "@/lib/host/queries";

type Props = { params: Promise<{ locale: Locale; id: string }> };

export default async function HostGamePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireHost();
  const t = await getTranslations("host");

  const gameId = Number(id);
  if (!Number.isInteger(gameId)) {
    notFound();
  }

  let data;
  try {
    data = await request(HostGameQuery, { id: gameId });
  } catch (error) {
    if (error instanceof GraphQLRequestError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
  const { actions } = await request(NightActionsQuery, { gameId });

  return (
    <PageLayout
      title={
        <Link href="/host" className="hover:underline">
          {t("title")}
        </Link>
      }
    >
      <GameControl game={data.game} roles={data.roles} actions={actions} />
    </PageLayout>
  );
}
