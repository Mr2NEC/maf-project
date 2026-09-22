"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { GameEvent } from "./events";
import { seatLabel } from "./types";

const names = (players: { seatNumber?: number | null; username: string }[]) =>
  players.map(seatLabel).join(", ");

/** Results of nights and days in this session, newest first. */
export function EventLog({ events }: { events: GameEvent[] }) {
  const t = useTranslations("host");
  const tGame = useTranslations("game");
  if (events.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("events")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {events.map((event, index) => (
          <div key={index} className="rounded-md border p-3">
            {event.kind === "night" ? (
              <>
                <div className="font-medium">{tGame("phase.NIGHT", { round: event.round })}</div>
                <div>
                  {event.result.killed.length
                    ? t("killed", { players: names(event.result.killed) })
                    : t("nobody-killed")}
                </div>
                {event.result.saved.length > 0 && (
                  <div>{t("saved", { players: names(event.result.saved) })}</div>
                )}
                {event.result.blocked.length > 0 && (
                  <div>{t("blocked", { players: names(event.result.blocked) })}</div>
                )}
                {event.result.checks.map((check, i) => (
                  <div key={i}>
                    {t("check", {
                      actor: seatLabel(check.actor),
                      target: seatLabel(check.target),
                      result: check.team ? tGame(`team.${check.team}`) : t("check-blocked"),
                    })}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="font-medium">{tGame("phase.DAY", { round: event.round })}</div>
                <div>
                  {event.result.eliminated.length
                    ? t("voted-out", { players: names(event.result.eliminated) })
                    : t("nobody-voted-out")}
                </div>
              </>
            )}
            {event.result.game.winnerTeam && (
              <div className="mt-1 font-semibold">
                {tGame(`winner.${event.result.game.winnerTeam}`)}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
