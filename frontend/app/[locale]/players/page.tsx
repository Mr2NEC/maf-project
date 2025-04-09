import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function PlayersPage() {
  const t = useTranslations("players-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
