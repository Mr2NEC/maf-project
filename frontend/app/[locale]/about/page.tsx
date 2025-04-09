import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
