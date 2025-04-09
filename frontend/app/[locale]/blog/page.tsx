import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function BlogPage() {
  const t = useTranslations("blog-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
