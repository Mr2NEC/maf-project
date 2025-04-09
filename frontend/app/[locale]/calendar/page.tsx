import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function CalendarPage() {
  const t = useTranslations("calendar-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
