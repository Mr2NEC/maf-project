"use client";

import { useTranslations } from "next-intl";
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { addFoul, removePlayer } from "@/lib/host/actions";
import { cn } from "@/lib/utils";
import { CommandError } from "./command-error";
import type { HostGame } from "./types";
import { useCommand } from "./use-command";

/** The table as the host sees it: seats, roles, status and fouls. */
export function SeatList({ game }: { game: HostGame }) {
  const t = useTranslations("host");
  const tGame = useTranslations("game");
  const { pending, error, run } = useCommand();
  const gameId = Number(game.id);
  const inProgress = game.status === "IN_PROGRESS";

  return (
    <div className="flex flex-col gap-3">
      <CommandError error={error} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>{t("player")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead>{t("fouls")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {game.players.map((player) => {
            const out = player.status !== "ALIVE";
            return (
              <TableRow key={player.id} className={cn(out && "opacity-50")}>
                <TableCell className="font-mono">{player.seatNumber}</TableCell>
                <TableCell>
                  <div className={cn("font-medium", out && "line-through")}>{player.username}</div>
                  {out && (
                    <div className="text-xs text-muted-foreground">
                      {tGame(`player-status.${player.status}`)}
                      {player.eliminatedRound ? ` · ${t("round", { round: player.eliminatedRound })}` : ""}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {player.role ? (
                    <Badge variant={player.role.team === "MAFIA" ? "destructive" : player.role.team === "NEUTRAL" ? "default" : "secondary"}>
                      {player.role.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {player.fouls}/{game.gameType.maxFouls}
                </TableCell>
                <TableCell className="text-right">
                  {inProgress && !out && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() => run(() => addFoul(gameId, Number(player.id)))}
                    >
                      {t("add-foul")}
                    </Button>
                  )}
                  {game.status === "WAITING" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      onClick={() => run(() => removePlayer(gameId, Number(player.id)))}
                    >
                      {t("remove")}
                    </Button>
                  )}
                  {game.status === "FINISHED" && <span className="font-mono">{player.points}</span>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
