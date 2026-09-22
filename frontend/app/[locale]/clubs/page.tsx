import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CreateClubForm } from "@/components/clubs/create-club-form";
import { PageLayout } from "@/components/shared";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { ClubsQuery } from "@/lib/clubs/queries";
import { request } from "@/lib/graphql/client";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">) {
  const t = await getTranslations({ locale: (await params).locale, namespace: "clubs" });
  return { title: t("title") };
}

export default async function ClubsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("clubs");
  const tRole = await getTranslations("club-role");
  const search = (await searchParams).q?.trim() || undefined;
  const [{ clubs }, user] = await Promise.all([request(ClubsQuery, { search }), getCurrentUser()]);
  const membership = (clubId: string) => user?.clubs.find((m) => String(m.clubId) === clubId);

  return (
    <PageLayout title={t("title")}>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <form className="mb-6 flex max-w-md gap-2" role="search">
            <Input name="q" defaultValue={search} placeholder={t("search")} aria-label={t("search")} />
            <Button type="submit" variant="outline">
              {t("find")}
            </Button>
          </form>
          {clubs.length === 0 ? (
            <p className="text-muted-foreground">{t("empty")}</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {clubs.map((club) => {
                const mine = membership(club.id);
                return (
                  <li key={club.id}>
                    <Link
                      href={{ pathname: "/clubs/[id]", params: { id: club.id } }}
                      className="flex h-full flex-col gap-1 rounded-lg border p-4 hover:bg-muted/50"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium">{club.title}</span>
                        {mine && (
                          <Badge variant="secondary">
                            {mine.status === "PENDING" ? t("request-sent") : tRole(mine.role)}
                          </Badge>
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{club.region}</span>
                      {club.description && <span className="line-clamp-2 text-sm">{club.description}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <Card className="self-start">
          <CardHeader>
            <CardTitle>{t("new-club")}</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <CreateClubForm />
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/login" className="underline">
                  {t("sign-in-to-create")}
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
