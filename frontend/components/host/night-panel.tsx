"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Label, Select } from "@/components/ui";
import { endNight, recordNightAction, removeNightAction } from "@/lib/host/actions";
import { CommandError } from "./command-error";
import type { GameEvent } from "./events";
import {
  type HostAction,
  type HostGame,
  type HostPlayer,
  type HostRoles,
  isAlive,
  seatLabel,
} from "./types";
import { useCommand } from "./use-command";

type Props = {
  game: HostGame;
  roles: HostRoles;
  actions: HostAction[];
  onEvent: (event: GameEvent) => void;
};

export function NightPanel({ game, roles, actions, onEvent }: Props) {
  const t = useTranslations("host");
  const { pending, error, run } = useCommand();
  const gameId = Number(game.id);
  const alive = game.players.filter(isAlive);
  const byId = new Map(game.players.map((p) => [Number(p.id), p]));

  const recorded = actions.filter((a) => a.phase === "NIGHT" && a.round === game.currentRound);
  const actedIds = new Set(recorded.map((a) => a.actorId));
  // The mafia shoots once per night as a team (same rule as the engine)
  const mafiaShot = recorded.some(
    (a) => a.actionType.effect === "KILL" && byId.get(a.actorId)?.role?.team === "MAFIA"
  );

  const nightActionsOf = (player?: HostPlayer) =>
    roles
      .find((r) => r.id === player?.role?.id)
      ?.actions.map((a) => a.actionType)
      .filter((type) => type.phase !== "DAY" && type.effect !== "VOTE")
      .filter((type) => !(mafiaShot && type.effect === "KILL" && player?.role?.team === "MAFIA")) ??
    [];

  const actors = alive.filter(
    (p) => nightActionsOf(p).length > 0 && !actedIds.has(Number(p.id))
  );

  const [actorId, setActorId] = useState("");
  const [actionTypeId, setActionTypeId] = useState("");
  const [targetId, setTargetId] = useState("");
  const actor = actorId ? byId.get(Number(actorId)) : undefined;
  const actorActions = nightActionsOf(actor);
  const chosenAction = actionTypeId || (actorActions.length === 1 ? actorActions[0].id : "");

  function record() {
    run(
      () =>
        recordNightAction(gameId, {
          actorId: Number(actorId),
          actionTypeId: Number(chosenAction),
          targetId: Number(targetId),
        }),
      () => {
        setActorId("");
        setActionTypeId("");
        setTargetId("");
      }
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <CommandError error={error} />

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="actor">{t("who-acts")}</Label>
          <Select id="actor" value={actorId} onChange={(e) => { setActorId(e.target.value); setActionTypeId(""); }}>
            <option value="">—</option>
            {actors.map((p) => (
              <option key={p.id} value={p.id}>
                {seatLabel(p)} ({p.role?.name})
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="action">{t("action")}</Label>
          <Select id="action" value={chosenAction} onChange={(e) => setActionTypeId(e.target.value)} disabled={!actor}>
            <option value="">—</option>
            {actorActions.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="target">{t("target")}</Label>
          <Select id="target" value={targetId} onChange={(e) => setTargetId(e.target.value)} disabled={!actor}>
            <option value="">—</option>
            {alive.map((p) => (
              <option key={p.id} value={p.id}>
                {seatLabel(p)}
              </option>
            ))}
          </Select>
        </div>
        <Button className="sm:col-span-3" disabled={pending || !actorId || !chosenAction || !targetId} onClick={record}>
          {t("record-action")}
        </Button>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-semibold">{t("this-night")}</h3>
        {recorded.length === 0 && <p className="text-sm text-muted-foreground">{t("quiet-night")}</p>}
        {recorded.map((action) => {
          const who = byId.get(action.actorId);
          const targetPlayerId = action.targets?.[0]?.targetId;
          const whom = targetPlayerId === undefined ? undefined : byId.get(targetPlayerId);
          return (
            <div key={action.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <span>
                {who && seatLabel(who)} → <b>{action.actionType.name}</b> → {whom && seatLabel(whom)}
              </span>
              <Button size="sm" variant="ghost" disabled={pending} onClick={() => run(() => removeNightAction(gameId, Number(action.id)))}>
                {t("remove")}
              </Button>
            </div>
          );
        })}
      </section>

      <Button
        size="lg"
        disabled={pending}
        onClick={() =>
          run(() => endNight(gameId), (result) =>
            onEvent({ kind: "night", round: game.currentRound, result })
          )
        }
      >
        {t("end-night")}
      </Button>
    </div>
  );
}
