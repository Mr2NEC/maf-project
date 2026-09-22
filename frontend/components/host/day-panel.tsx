"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Alert, Button, Label, Select } from "@/components/ui";
import type { TieBreak } from "@/gql/graphql";
import { endDay } from "@/lib/host/actions";
import { CommandError } from "./command-error";
import type { GameEvent } from "./events";
import { type HostGame, isAlive, seatLabel } from "./types";
import { useCommand } from "./use-command";

type Props = {
  game: HostGame;
  onEvent: (event: GameEvent) => void;
};

type Seat = { seatNumber?: number | null; username: string };

/** Day vote: for each living player, who they voted against (or nobody). */
export function DayPanel({ game, onEvent }: Props) {
  const t = useTranslations("host");
  const { pending, error, run } = useCommand();
  const gameId = Number(game.id);
  const alive = game.players.filter(isAlive);

  const [votes, setVotes] = useState<Record<string, string>>({});
  const [tied, setTied] = useState<Seat[] | null>(null);

  const byTarget = new Map<number, number[]>();
  for (const [voterId, targetId] of Object.entries(votes)) {
    if (targetId) {
      byTarget.set(Number(targetId), [...(byTarget.get(Number(targetId)) ?? []), Number(voterId)]);
    }
  }
  const groups = [...byTarget].map(([targetId, voterIds]) => ({ targetId, voterIds }));

  function submit(tieBreak?: TieBreak) {
    run(
      () => endDay(gameId, groups, tieBreak),
      (result) => {
        if (result.tie) {
          setTied(result.tiedPlayers);
          return;
        }
        setTied(null);
        setVotes({});
        onEvent({ kind: "day", round: game.currentRound, result });
      }
    );
  }

  const tally = groups
    .map((g) => ({
      player: alive.find((p) => Number(p.id) === g.targetId),
      count: g.voterIds.length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-5">
      <CommandError error={error} />

      <section className="grid gap-2 sm:grid-cols-2">
        {alive.map((voter) => (
          <div key={voter.id} className="flex items-center gap-2">
            <Label className="w-32 shrink-0" htmlFor={`vote-${voter.id}`}>
              {seatLabel(voter)}
            </Label>
            <Select
              id={`vote-${voter.id}`}
              value={votes[voter.id] ?? ""}
              onChange={(e) => {
                setTied(null);
                setVotes((v) => ({ ...v, [voter.id]: e.target.value }));
              }}
            >
              <option value="">{t("no-vote")}</option>
              {alive
                .filter((p) => p.id !== voter.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {seatLabel(p)}
                  </option>
                ))}
            </Select>
          </div>
        ))}
      </section>

      {tally.length > 0 && (
        <p className="text-sm">
          {t("tally")}:{" "}
          {tally
            .map(({ player, count }) => `${player ? seatLabel(player) : "?"} — ${count}`)
            .join(", ")}
        </p>
      )}

      {tied ? (
        <Alert>
          <p className="font-medium">{t("tie", { players: tied.map(seatLabel).join(", ") })}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="destructive" disabled={pending} onClick={() => submit("ELIMINATE_ALL")}>
              {t("eliminate-all")}
            </Button>
            <Button variant="outline" disabled={pending} onClick={() => submit("KEEP_ALL")}>
              {t("keep-all")}
            </Button>
            <Button
              variant="ghost"
              disabled={pending}
              onClick={() => {
                setTied(null);
                setVotes({});
              }}
            >
              {t("revote")}
            </Button>
          </div>
        </Alert>
      ) : (
        <Button size="lg" disabled={pending} onClick={() => submit()}>
          {groups.length ? t("end-day") : t("end-day-no-vote")}
        </Button>
      )}
    </div>
  );
}
