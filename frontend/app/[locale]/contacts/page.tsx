import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";

export default function ContactsPage() {
  const t = useTranslations("contacts-page");

  return <PageLayout title={t("title")}></PageLayout>;
}
