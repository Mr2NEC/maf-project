"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { graphql } from "@/gql";
import type { ClubRole, TournamentStatus } from "@/gql/graphql";
import { redirect } from "@/i18n/navigation";
import { requireUser } from "@/lib/auth/guards";
import { GraphQLRequestError, request } from "@/lib/graphql/client";
import type { HostActionResult as ActionResult } from "@/lib/host/actions";

/** Runs a club command; the API checks the club role, so errors are shown as is. */
async function run<T>(command: () => Promise<T>): Promise<ActionResult<T>> {
  await requireUser();
  try {
    const data = await command();
    // Membership changes show up in the header and on every club page
    revalidatePath("/", "layout");
    return { ok: true, data };
  } catch (error) {
    if (error instanceof GraphQLRequestError) {
      return { ok: false, error: error.details?.join("; ") || error.message };
    }
    throw error;
  }
}

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const optionalText = (form: FormData, name: string) => text(form, name) || undefined;
/** A calendar day from input[type=date]; noon UTC is the same day in every zone. */
const day = (value: string) => (value ? new Date(`${value}T12:00:00.000Z`).toISOString() : undefined);

const CreateClubMutation = graphql(`
  mutation CreateClub($input: CreateClubInput!) {
    createClub(input: $input) {
      id
    }
  }
`);

export async function createClub(_state: ActionResult | null, form: FormData): Promise<ActionResult> {
  const result = await run(() =>
    request(CreateClubMutation, {
      input: {
        title: text(form, "title"),
        region: text(form, "region"),
        description: optionalText(form, "description"),
      },
    })
  );
  if (!result.ok) {
    return result;
  }
  redirect({
    href: { pathname: "/clubs/[id]", params: { id: result.data.createClub.id } },
    locale: await getLocale(),
  });
  return { ok: true, data: undefined };
}

const UpdateClubMutation = graphql(`
  mutation UpdateClub($id: Int!, $input: UpdateClubInput!) {
    updateClub(id: $id, input: $input) {
      id
    }
  }
`);

export async function updateClub(
  clubId: number,
  _state: ActionResult | null,
  form: FormData
): Promise<ActionResult> {
  const result = await run(() =>
    request(UpdateClubMutation, {
      id: clubId,
      input: {
        title: text(form, "title"),
        region: text(form, "region"),
        description: text(form, "description"),
      },
    })
  );
  return result.ok ? { ok: true, data: undefined } : result;
}

const UpdateRatingRulesMutation = graphql(`
  mutation UpdateRatingRules($clubId: Int!, $rules: RatingRulesInput!) {
    updateRatingRules(clubId: $clubId, rules: $rules) {
      id
    }
  }
`);

export async function updateRatingRules(
  clubId: number,
  _state: ActionResult | null,
  form: FormData
): Promise<ActionResult> {
  const number = (name: string) => Number(text(form, name).replace(",", "."));
  const result = await run(() =>
    request(UpdateRatingRulesMutation, {
      clubId,
      rules: {
        townWinPoints: number("townWinPoints"),
        mafiaWinPoints: number("mafiaWinPoints"),
        neutralWinPoints: number("neutralWinPoints"),
        lossPoints: number("lossPoints"),
        bonusEnabled: form.get("bonusEnabled") === "on",
        minGames: Math.trunc(number("minGames")),
      },
    })
  );
  return result.ok ? { ok: true, data: undefined } : result;
}

const JoinClubMutation = graphql(`
  mutation JoinClub($clubId: Int!) {
    joinClub(clubId: $clubId) {
      id
    }
  }
`);

export async function joinClub(clubId: number) {
  return run(() => request(JoinClubMutation, { clubId }));
}

const LeaveClubMutation = graphql(`
  mutation LeaveClub($clubId: Int!) {
    leaveClub(clubId: $clubId)
  }
`);

export async function leaveClub(clubId: number) {
  return run(() => request(LeaveClubMutation, { clubId }));
}

const ApproveMemberMutation = graphql(`
  mutation ApproveClubMember($memberId: Int!) {
    approveClubMember(memberId: $memberId) {
      id
    }
  }
`);

export async function approveMember(memberId: number) {
  return run(() => request(ApproveMemberMutation, { memberId }));
}

const SetMemberRoleMutation = graphql(`
  mutation SetClubMemberRole($memberId: Int!, $role: ClubRole!) {
    setClubMemberRole(memberId: $memberId, role: $role) {
      id
    }
  }
`);

export async function setMemberRole(memberId: number, role: ClubRole) {
  return run(() => request(SetMemberRoleMutation, { memberId, role }));
}

const RemoveMemberMutation = graphql(`
  mutation RemoveClubMember($memberId: Int!) {
    removeClubMember(memberId: $memberId)
  }
`);

/** Also rejects a join request. */
export async function removeMember(memberId: number) {
  return run(() => request(RemoveMemberMutation, { memberId }));
}

const CreateTournamentMutation = graphql(`
  mutation CreateTournament($input: CreateTournamentInput!) {
    createTournament(input: $input) {
      id
    }
  }
`);

export async function createTournament(
  clubId: number,
  _state: ActionResult | null,
  form: FormData
): Promise<ActionResult> {
  const result = await run(() =>
    request(CreateTournamentMutation, {
      input: {
        clubId,
        name: text(form, "name"),
        description: optionalText(form, "description"),
        startDate: day(text(form, "startDate"))!,
        endDate: day(text(form, "endDate")),
      },
    })
  );
  if (!result.ok) {
    return result;
  }
  redirect({
    href: { pathname: "/tournaments/[id]", params: { id: result.data.createTournament.id } },
    locale: await getLocale(),
  });
  return { ok: true, data: undefined };
}

const UpdateTournamentMutation = graphql(`
  mutation UpdateTournament($id: Int!, $input: UpdateTournamentInput!) {
    updateTournament(id: $id, input: $input) {
      id
    }
  }
`);

export async function setTournamentStatus(tournamentId: number, status: TournamentStatus) {
  return run(() => request(UpdateTournamentMutation, { id: tournamentId, input: { status } }));
}

const DeleteTournamentMutation = graphql(`
  mutation DeleteTournament($id: Int!) {
    deleteTournament(id: $id)
  }
`);

export async function deleteTournament(tournamentId: number, clubId: number) {
  const result = await run(() => request(DeleteTournamentMutation, { id: tournamentId }));
  if (!result.ok) {
    return result;
  }
  redirect({
    href: { pathname: "/clubs/[id]", params: { id: String(clubId) } },
    locale: await getLocale(),
  });
  return result;
}

const AddParticipantMutation = graphql(`
  mutation AddTournamentParticipant($tournamentId: Int!, $userId: Int!) {
    addTournamentParticipant(tournamentId: $tournamentId, userId: $userId) {
      id
    }
  }
`);

export async function addParticipant(tournamentId: number, userId: number) {
  return run(() => request(AddParticipantMutation, { tournamentId, userId }));
}

const RemoveParticipantMutation = graphql(`
  mutation RemoveTournamentParticipant($tournamentId: Int!, $userId: Int!) {
    removeTournamentParticipant(tournamentId: $tournamentId, userId: $userId) {
      id
    }
  }
`);

export async function removeParticipant(tournamentId: number, userId: number) {
  return run(() => request(RemoveParticipantMutation, { tournamentId, userId }));
}
