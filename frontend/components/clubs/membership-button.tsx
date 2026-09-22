"use client";

import { useTranslations } from "next-intl";
import { CommandError } from "@/components/host/command-error";
import { useCommand } from "@/components/host/use-command";
import { Button } from "@/components/ui";
import type { MembershipStatus } from "@/gql/graphql";
import { joinClub, leaveClub } from "@/lib/clubs/actions";

type Props = {
  clubId: number;
  status: MembershipStatus | null;
};

/** Join request, its pending state, or leaving the club. */
export function MembershipButton({ clubId, status }: Props) {
  const t = useTranslations("club-page");
  const { pending, error, run } = useCommand();

  return (
    <div className="flex flex-col items-start gap-2">
      {status === null && (
        <Button disabled={pending} onClick={() => run(() => joinClub(clubId))}>
          {t("join")}
        </Button>
      )}
      {status === "PENDING" && <span className="text-sm text-muted-foreground">{t("request-pending")}</span>}
      {status !== null && (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => {
            if (status === "PENDING" || window.confirm(t("leave-confirm"))) {
              run(() => leaveClub(clubId));
            }
          }}
        >
          {status === "PENDING" ? t("cancel-request") : t("leave")}
        </Button>
      )}
      <CommandError error={error} />
    </div>
  );
}
