import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function IndexPage() {
  const t = useTranslations("index-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
