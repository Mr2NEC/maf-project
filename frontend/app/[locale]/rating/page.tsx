import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function RatingPage() {
  const t = useTranslations("rating-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
