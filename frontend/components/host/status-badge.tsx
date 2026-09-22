import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui";
import type { GamePhase, GameStatus } from "@/gql/graphql";

export function GameStatusBadge({
  status,
  phase,
  round,
}: {
  status: GameStatus;
  phase?: GamePhase | null;
  round?: number;
}) {
  const t = useTranslations("game");
  if (status === "IN_PROGRESS" && phase) {
    return <Badge>{t(`phase.${phase}`, { round: round ?? 1 })}</Badge>;
  }
  return (
    <Badge variant={status === "FINISHED" ? "secondary" : "outline"}>
      {t(`status.${status}`)}
    </Badge>
  );
}
