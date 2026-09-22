"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { graphql } from "@/gql";
import type { TieBreak } from "@/gql/graphql";
import { getPathname, redirect } from "@/i18n/navigation";
import { requireHost } from "@/lib/auth/guards";
import { GraphQLRequestError, request } from "@/lib/graphql/client";
import { SearchUsersQuery } from "./queries";

/** What every host command returns to the panel. */
export type HostActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function run<T>(
  gameId: number | null,
  command: () => Promise<T>
): Promise<HostActionResult<T>> {
  await requireHost();
  try {
    const data = await command();
    if (gameId !== null) {
      revalidatePath(
        getPathname({
          href: { pathname: "/host/games/[id]", params: { id: String(gameId) } },
          locale: await getLocale(),
        })
      );
    }
    return { ok: true, data };
  } catch (error) {
    if (error instanceof GraphQLRequestError) {
      return { ok: false, error: error.details?.join("; ") || error.message };
    }
    throw error;
  }
}

const CreateGameMutation = graphql(`
  mutation CreateGame($data: CreateGameInput!) {
    createGame(data: $data) {
      id
    }
  }
`);

export async function createGame(
  _state: HostActionResult | null,
  form: FormData
): Promise<HostActionResult> {
  const result = await run(null, () =>
    request(CreateGameMutation, {
      data: {
        gameTypeId: Number(form.get("gameTypeId")),
        // datetime-local has no zone: it is the host's local time
        startDate: new Date(String(form.get("startDate"))).toISOString(),
      },
    })
  );
  if (!result.ok) {
    return result;
  }
  redirect({
    href: { pathname: "/host/games/[id]", params: { id: result.data.createGame.id } },
    locale: await getLocale(),
  });
  return { ok: true, data: undefined };
}

export async function searchUsers(search: string) {
  await requireHost();
  if (search.trim().length < 2) {
    return [];
  }
  return (await request(SearchUsersQuery, { search: search.trim() })).users;
}

const AddPlayerMutation = graphql(`
  mutation AddPlayer($gameId: Int!, $input: AddPlayerInput!) {
    addPlayerToGame(gameId: $gameId, input: $input) {
      id
    }
  }
`);

export async function addPlayer(gameId: number, userId: number) {
  return run(gameId, () =>
    request(AddPlayerMutation, { gameId, input: { userId } })
  );
}

const RemovePlayerMutation = graphql(`
  mutation RemovePlayer($gameId: Int!, $playerId: Int!) {
    removePlayerFromGame(gameId: $gameId, playerId: $playerId) {
      id
    }
  }
`);

export async function removePlayer(gameId: number, playerId: number) {
  return run(gameId, () => request(RemovePlayerMutation, { gameId, playerId }));
}

const AssignRolesMutation = graphql(`
  mutation AssignRoles($gameId: Int!, $input: AssignRolesInput!) {
    assignRoles(gameId: $gameId, input: $input) {
      id
    }
  }
`);

export async function assignRoles(
  gameId: number,
  assignments: { playerId: number; roleId: number }[] | "random"
) {
  return run(gameId, () =>
    request(AssignRolesMutation, {
      gameId,
      input:
        assignments === "random"
          ? { random: true }
          : { random: false, assignments },
    })
  );
}

const StartGameMutation = graphql(`
  mutation StartGame($gameId: Int!) {
    startGame(gameId: $gameId) {
      id
    }
  }
`);

export async function startGame(gameId: number) {
  return run(gameId, () => request(StartGameMutation, { gameId }));
}

const RecordNightActionMutation = graphql(`
  mutation RecordNightAction($gameId: Int!, $input: NightActionInput!) {
    recordNightAction(gameId: $gameId, input: $input) {
      id
    }
  }
`);

export async function recordNightAction(
  gameId: number,
  input: { actorId: number; actionTypeId: number; targetId: number }
) {
  return run(gameId, () => request(RecordNightActionMutation, { gameId, input }));
}

const RemoveNightActionMutation = graphql(`
  mutation RemoveNightAction($gameId: Int!, $actionId: Int!) {
    removeNightAction(gameId: $gameId, actionId: $actionId)
  }
`);

export async function removeNightAction(gameId: number, actionId: number) {
  return run(gameId, () => request(RemoveNightActionMutation, { gameId, actionId }));
}

const EndNightMutation = graphql(`
  mutation EndNight($gameId: Int!) {
    endNight(gameId: $gameId) {
      killed {
        seatNumber
        username
      }
      saved {
        seatNumber
        username
      }
      blocked {
        seatNumber
        username
      }
      checks {
        actor {
          seatNumber
          username
        }
        target {
          seatNumber
          username
        }
        team
      }
      game {
        status
        winnerTeam
      }
    }
  }
`);

export async function endNight(gameId: number) {
  return run(gameId, async () => (await request(EndNightMutation, { gameId })).endNight);
}

const EndDayMutation = graphql(`
  mutation EndDay($gameId: Int!, $input: EndDayInput!) {
    endDay(gameId: $gameId, input: $input) {
      tie
      tiedPlayers {
        id
        seatNumber
        username
      }
      eliminated {
        seatNumber
        username
      }
      game {
        status
        winnerTeam
      }
    }
  }
`);

export async function endDay(
  gameId: number,
  votes: { targetId: number; voterIds: number[] }[],
  tieBreak?: TieBreak
) {
  return run(gameId, async () =>
    (await request(EndDayMutation, { gameId, input: { votes, tieBreak } })).endDay
  );
}

const AddFoulMutation = graphql(`
  mutation AddFoul($gameId: Int!, $playerId: Int!) {
    addFoul(gameId: $gameId, playerId: $playerId) {
      id
    }
  }
`);

export async function addFoul(gameId: number, playerId: number) {
  return run(gameId, () => request(AddFoulMutation, { gameId, playerId }));
}

const CancelGameMutation = graphql(`
  mutation CancelGame($gameId: Int!) {
    cancelGame(gameId: $gameId) {
      id
    }
  }
`);

export async function cancelGame(gameId: number) {
  return run(gameId, () => request(CancelGameMutation, { gameId }));
}

const AwardBonusMutation = graphql(`
  mutation AwardBonus($gameId: Int!, $input: AwardBonusInput!) {
    awardBonus(gameId: $gameId, input: $input) {
      id
    }
  }
`);

export async function awardBonus(gameId: number, playerId: number, points: number) {
  return run(gameId, () =>
    request(AwardBonusMutation, { gameId, input: { playerId, points } })
  );
}
