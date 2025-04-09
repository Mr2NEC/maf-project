import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcherDropdown } from "./locale-switcher-dropdown";

export const LocaleSwitcher = () => {
  const t = useTranslations("locale-switcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherDropdown
      value={locale}
      items={[
        {
          value: "en",
          label: t("en"),
        },
        {
          value: "uk",
          label: t("uk"),
        },
      ]}
      label={t("label")}
    />
  );
};
