import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { signOutAction } from "@/lib/auth/actions";
import { getCurrentUser, isHost } from "@/lib/auth/session";

/** Sign-in link, or the user's name, host panel link and sign-out. */
export async function UserMenu() {
  const t = await getTranslations("auth");
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">{t("sign-in")}</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isHost(user) && (
        <Button asChild size="sm">
          <Link href="/host">{t("host-panel")}</Link>
        </Button>
      )}
      <Button asChild variant="ghost" size="sm">
        <Link href={{ pathname: "/players/[id]", params: { id: user.id } }}>
          {user.username}
        </Link>
      </Button>
      <form action={signOutAction}>
        <Button type="submit" variant="outline" size="sm">
          {t("sign-out")}
        </Button>
      </form>
    </div>
  );
}
