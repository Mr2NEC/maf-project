"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cancelGame } from "@/lib/host/actions";
import { CommandError } from "./command-error";
import { DayPanel } from "./day-panel";
import { EventLog } from "./event-log";
import type { GameEvent } from "./events";
import { NightPanel } from "./night-panel";
import { ResultsPanel } from "./results-panel";
import { SeatList } from "./seat-list";
import { SetupPanel } from "./setup-panel";
import { GameStatusBadge } from "./status-badge";
import type { HostAction, HostGame, HostRoles } from "./types";
import { useCommand } from "./use-command";

type Props = {
  game: HostGame;
  roles: HostRoles;
  actions: HostAction[];
};

/**
 * The host's screen for one game. Server actions revalidate the page, so the
 * props always hold the fresh state; night and day results are kept here so
 * they stay visible after the phase changes.
 */
export function GameControl({ game, roles, actions }: Props) {
  const t = useTranslations("host");
  const [events, setEvents] = useState<GameEvent[]>([]);
  const addEvent = (event: GameEvent) => setEvents((list) => [event, ...list]);
  const { pending, error, run } = useCommand();
  const gameId = Number(game.id);
  const canCancel = game.status === "WAITING" || game.status === "IN_PROGRESS";

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-3">
              {game.gameType.name}
              <GameStatusBadge status={game.status} phase={game.phase} round={game.currentRound} />
            </CardTitle>
            {canCancel && (
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => {
                  if (window.confirm(t("cancel-confirm"))) {
                    run(() => cancelGame(gameId));
                  }
                }}
              >
                {t("cancel-game")}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CommandError error={error} />
            {game.status === "WAITING" && <SetupPanel game={game} />}
            {game.status === "IN_PROGRESS" && game.phase === "NIGHT" && (
              <NightPanel game={game} roles={roles} actions={actions} onEvent={addEvent} />
            )}
            {game.status === "IN_PROGRESS" && game.phase === "DAY" && (
              <DayPanel game={game} onEvent={addEvent} />
            )}
            {game.status === "FINISHED" && <ResultsPanel game={game} />}
            {game.status === "CANCELLED" && (
              <p className="text-muted-foreground">{t("cancelled")}</p>
            )}
          </CardContent>
        </Card>
        <EventLog events={events} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("table")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SeatList game={game} />
        </CardContent>
      </Card>
    </div>
  );
}
