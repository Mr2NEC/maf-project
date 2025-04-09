import { useTranslations } from "next-intl";
import { PageLayout } from "./page-layout";

export default function NotFoundPage() {
  const t = useTranslations("not-found-page");

  return (
    <PageLayout title={t("title")}>
      <p className="max-w-[460px]">{t("description")}</p>
    </PageLayout>
  );
}
