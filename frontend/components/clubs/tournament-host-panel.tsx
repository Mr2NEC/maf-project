"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CommandError } from "@/components/host/command-error";
import { useCommand } from "@/components/host/use-command";
import { Button, Input } from "@/components/ui";
import type { TournamentStatus } from "@/gql/graphql";
import {
  addParticipant,
  deleteTournament,
  removeParticipant,
  setTournamentStatus,
} from "@/lib/clubs/actions";
import { searchUsers } from "@/lib/host/actions";

type Props = {
  tournamentId: number;
  clubId: number;
  status: TournamentStatus;
  participants: { id: string; user: { id: string; username: string } }[];
  hasGames: boolean;
};

const NEXT_STATUS: Partial<Record<TournamentStatus, "ACTIVE" | "FINISHED">> = {
  PLANNED: "ACTIVE",
  ACTIVE: "FINISHED",
};

/** Participants, status and deletion, for the club's hosts. */
export function TournamentHostPanel({ tournamentId, clubId, status, participants, hasGames }: Props) {
  const t = useTranslations("tournament-page");
  const { pending, error, run } = useCommand();
  const [search, setSearch] = useState("");
  const [found, setFound] = useState<{ id: string; username: string }[]>([]);
  const seated = new Set(participants.map((p) => p.user.id));
  const next = NEXT_STATUS[status];

  return (
    <div className="flex flex-col gap-4">
      <CommandError error={error} />
      <div className="flex flex-wrap gap-2">
        {next && (
          <Button disabled={pending} onClick={() => run(() => setTournamentStatus(tournamentId, next))}>
            {t(`set-status.${next}`)}
          </Button>
        )}
        {!hasGames && (
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => {
              if (window.confirm(t("delete-confirm"))) {
                run(() => deleteTournament(tournamentId, clubId));
              }
            }}
          >
            {t("delete")}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">{t("participants", { count: participants.length })}</h3>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setFound(await searchUsers(search));
          }}
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search-player")}
            aria-label={t("search-player")}
          />
          <Button type="submit" variant="outline">
            {t("search")}
          </Button>
        </form>
        {found
          .filter((user) => !seated.has(user.id))
          .map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-md border p-2">
              <span>{user.username}</span>
              <Button
                size="sm"
                disabled={pending}
                onClick={() =>
                  run(
                    () => addParticipant(tournamentId, Number(user.id)),
                    () => setFound((list) => list.filter((u) => u.id !== user.id))
                  )
                }
              >
                {t("add")}
              </Button>
            </div>
          ))}
        <ul className="flex flex-col gap-1">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
              <span>{participant.user.username}</span>
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => run(() => removeParticipant(tournamentId, Number(participant.user.id)))}
              >
                {t("remove")}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
