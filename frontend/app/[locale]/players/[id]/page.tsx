import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function PlayerPage() {
  const t = useTranslations("player-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
