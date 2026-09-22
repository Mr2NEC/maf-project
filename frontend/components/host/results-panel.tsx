"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input, Label, Select } from "@/components/ui";
import { awardBonus } from "@/lib/host/actions";
import { CommandError } from "./command-error";
import { type HostGame, seatLabel } from "./types";
import { useCommand } from "./use-command";

/** After the game: the winner and bonus points (e.g. for the best move). */
export function ResultsPanel({ game }: { game: HostGame }) {
  const t = useTranslations("host");
  const tGame = useTranslations("game");
  const { pending, error, run } = useCommand();
  const [playerId, setPlayerId] = useState("");
  const [points, setPoints] = useState("0.5");

  return (
    <div className="flex flex-col gap-5">
      {game.winnerTeam && (
        <p className="text-2xl font-semibold">{tGame(`winner.${game.winnerTeam}`)}</p>
      )}
      <CommandError error={error} />
      <section className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <div className="flex flex-col gap-2">
          <Label htmlFor="bonus-player">{t("bonus-player")}</Label>
          <Select id="bonus-player" value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
            <option value="">—</option>
            {game.players.map((p) => (
              <option key={p.id} value={p.id}>
                {seatLabel(p)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bonus-points">{t("bonus-points")}</Label>
          <Input
            id="bonus-points"
            type="number"
            step="0.1"
            min="-2"
            max="2"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
        <Button
          disabled={pending || !playerId || !points}
          onClick={() => run(() => awardBonus(Number(game.id), Number(playerId), Number(points)))}
        >
          {t("add-bonus")}
        </Button>
      </section>
    </div>
  );
}
