import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/auth/auth-form";
import { PageLayout } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { signUpAction } from "@/lib/auth/actions";

export default async function RegisterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <PageLayout title={t("register-title")}>
      <AuthForm mode="register" action={signUpAction} />
      <p className="mt-6 text-sm text-muted-foreground">
        {t("have-account")}{" "}
        <Link href="/login" className="underline underline-offset-4">
          {t("sign-in")}
        </Link>
      </p>
    </PageLayout>
  );
}
