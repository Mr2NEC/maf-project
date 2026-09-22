import { getFormatter, getTranslations } from "next-intl/server";
import type { RatingRulesInput as RatingRules } from "@/gql/graphql";

/** The club's rating rules in plain words. */
export async function RatingRulesSummary({ rules }: { rules: RatingRules }) {
  const t = await getTranslations("rating-rules");
  const format = await getFormatter();
  const n = (value: number) => format.number(value);

  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
      <li>
        {t("summary.wins", {
          town: n(rules.townWinPoints),
          mafia: n(rules.mafiaWinPoints),
          neutral: n(rules.neutralWinPoints),
        })}
      </li>
      <li>{t("summary.loss", { points: n(rules.lossPoints) })}</li>
      <li>{rules.bonusEnabled ? t("summary.bonus-on") : t("summary.bonus-off")}</li>
      {rules.minGames > 0 && <li>{t("summary.min-games", { count: rules.minGames })}</li>}
      <li>{t("summary.ties")}</li>
    </ul>
  );
}
