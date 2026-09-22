import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/auth/auth-form";
import { PageLayout } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { signInAction } from "@/lib/auth/actions";

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <PageLayout title={t("login-title")}>
      <AuthForm mode="login" action={signInAction} />
      <p className="mt-6 text-sm text-muted-foreground">
        {t("no-account")}{" "}
        <Link href="/register" className="underline underline-offset-4">
          {t("sign-up")}
        </Link>
      </p>
    </PageLayout>
  );
}
