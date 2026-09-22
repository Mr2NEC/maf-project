"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button, Input, Label, Select } from "@/components/ui";
import { addPlayer, assignRoles, searchUsers, startGame } from "@/lib/host/actions";
import { CommandError } from "./command-error";
import type { HostGame } from "./types";
import { useCommand } from "./use-command";

type FoundUser = { id: string; username: string };

/** Before the game: seat players, deal roles, start. */
export function SetupPanel({ game }: { game: HostGame }) {
  const t = useTranslations("host");
  const { pending, error, run } = useCommand();
  const gameId = Number(game.id);
  const { playersCount } = game.gameType;
  const full = game.players.length >= playersCount;
  const rolesDealt = game.players.length > 0 && game.players.every((p) => p.role);

  const [search, setSearch] = useState("");
  const [found, setFound] = useState<FoundUser[]>([]);
  const [searching, startSearch] = useTransition();
  const seatedUserIds = new Set(game.players.map((p) => String(p.userId)));

  // Manual dealing: playerId -> roleId
  const [manual, setManual] = useState<Record<string, string>>({});
  const roleOptions = game.gameType.gameTypeRoles.map((r) => r.role);

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    startSearch(async () => setFound(await searchUsers(search)));
  }

  return (
    <div className="flex flex-col gap-6">
      <CommandError error={error} />

      <section className="flex flex-col gap-3">
        <h3 className="font-semibold">
          {t("seating")} · {game.players.length}/{playersCount}
        </h3>
        {!full && (
          <>
            <form onSubmit={onSearch} className="flex gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search-player")}
                minLength={2}
              />
              <Button type="submit" variant="outline" disabled={searching}>
                {t("search")}
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {found
                .filter((user) => !seatedUserIds.has(user.id))
                .map((user) => (
                  <Button
                    key={user.id}
                    size="sm"
                    variant="secondary"
                    disabled={pending}
                    onClick={() =>
                      run(() => addPlayer(gameId, Number(user.id)), () =>
                        setFound((list) => list.filter((u) => u.id !== user.id))
                      )
                    }
                  >
                    + {user.username}
                  </Button>
                ))}
            </div>
          </>
        )}
      </section>

      {full && (
        <section className="flex flex-col gap-3">
          <h3 className="font-semibold">{t("roles")}</h3>
          <p className="text-sm text-muted-foreground">
            {game.gameType.gameTypeRoles.map((r) => `${r.role.name} × ${r.count}`).join(", ")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button disabled={pending} onClick={() => run(() => assignRoles(gameId, "random"))}>
              {t("deal-random")}
            </Button>
          </div>
          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-sm font-medium">{t("deal-manual")}</summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {game.players.map((player) => (
                <div key={player.id} className="flex items-center gap-2">
                  <Label className="w-32 shrink-0" htmlFor={`role-${player.id}`}>
                    {player.seatNumber}. {player.username}
                  </Label>
                  <Select
                    id={`role-${player.id}`}
                    value={manual[player.id] ?? player.role?.id?.toString() ?? ""}
                    onChange={(e) => setManual((m) => ({ ...m, [player.id]: e.target.value }))}
                  >
                    <option value="">—</option>
                    {roleOptions.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
            <Button
              className="mt-3"
              variant="outline"
              disabled={pending}
              onClick={() =>
                run(() =>
                  assignRoles(
                    gameId,
                    game.players.map((p) => ({
                      playerId: Number(p.id),
                      roleId: Number(manual[p.id] ?? p.role?.id ?? 0),
                    }))
                  )
                )
              }
            >
              {t("save-roles")}
            </Button>
          </details>
        </section>
      )}

      <Button
        size="lg"
        disabled={pending || !full || !rolesDealt}
        onClick={() => run(() => startGame(gameId))}
      >
        {t("start-game")}
      </Button>
      {!rolesDealt && full && <p className="text-sm text-muted-foreground">{t("start-hint")}</p>}
    </div>
  );
}
