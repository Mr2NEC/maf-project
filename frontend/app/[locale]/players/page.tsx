import { Locale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/shared";
import { Button, Input } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { request } from "@/lib/graphql/client";
import { PlayersQuery } from "@/lib/public/queries";

const PAGE_SIZE = 30;

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">) {
  const t = await getTranslations({ locale: (await params).locale, namespace: "players-page" });
  return { title: t("title") };
}

export default async function PlayersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("players-page");
  const format = await getFormatter();

  const { q, page } = await searchParams;
  const search = q?.trim() || undefined;
  const pageNumber = Math.max(1, Number(page) || 1);
  // One extra row tells whether there is a next page
  const { users } = await request(PlayersQuery, {
    search,
    skip: (pageNumber - 1) * PAGE_SIZE,
    take: PAGE_SIZE + 1,
  });
  const hasNext = users.length > PAGE_SIZE;

  return (
    <PageLayout title={t("title")}>
      {/* Plain GET form: works without JavaScript */}
      <form className="mb-6 flex max-w-md gap-2" role="search">
        <Input name="q" defaultValue={search} placeholder={t("search")} aria-label={t("search")} />
        <Button type="submit" variant="outline">
          {t("find")}
        </Button>
      </form>

      {users.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {users.slice(0, PAGE_SIZE).map((user) => (
            <li key={user.id}>
              <Link
                href={{ pathname: "/players/[id]", params: { id: user.id } }}
                className="flex flex-col rounded-lg border p-4 hover:bg-muted/50"
              >
                <span className="font-medium">{user.username}</span>
                <span className="text-sm text-muted-foreground">
                  {user.club?.title ??
                    t("member-since", {
                      date: format.dateTime(new Date(user.createdAt), { dateStyle: "long" }),
                    })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {(pageNumber > 1 || hasNext) && (
        <nav className="mt-6 flex gap-2">
          {pageNumber > 1 && (
            <Button asChild variant="outline" size="sm">
              <Link href={{ pathname: "/players", query: { ...(search && { q: search }), page: pageNumber - 1 } }}>
                {t("previous")}
              </Link>
            </Button>
          )}
          {hasNext && (
            <Button asChild variant="outline" size="sm">
              <Link href={{ pathname: "/players", query: { ...(search && { q: search }), page: pageNumber + 1 } }}>
                {t("next")}
              </Link>
            </Button>
          )}
        </nav>
      )}
    </PageLayout>
  );
}
