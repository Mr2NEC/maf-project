import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function TournamentsPage() {
  const t = useTranslations("tournaments-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
