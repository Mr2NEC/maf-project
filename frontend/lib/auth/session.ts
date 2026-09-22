import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { graphql } from "@/gql";
import type { ClubRole, MembershipStatus, UserRole } from "@/gql/graphql";
import {
  GraphQLRequestError,
  SESSION_COOKIE,
  request,
} from "@/lib/graphql/client";

const MeQuery = graphql(`
  query Me {
    me {
      id
      username
      email
      role
    }
    myClubs {
      id
      clubId
      role
      status
      club {
        title
      }
    }
  }
`);

export type SessionUser = {
  id: string;
  username: string;
  email?: string | null;
  role: UserRole;
  clubs: SessionMembership[];
};

export type SessionMembership = {
  memberId: string;
  clubId: number;
  title: string;
  role: ClubRole;
  status: MembershipStatus;
};

/** Reads the token's expiry so the cookie lives exactly as long as the token. */
function secondsUntilExpiry(token: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8")
    ) as { exp?: number };
    return payload.exp
      ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000))
      : 60 * 60;
  } catch {
    return 0;
  }
}

export async function startSession(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: secondsUntilExpiry(token),
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in user, or null. Cached for one render. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  if (!(await cookies()).has(SESSION_COOKIE)) {
    return null;
  }
  try {
    const { me, myClubs } = await request(MeQuery);
    return {
      ...me,
      clubs: myClubs.map((m) => ({
        memberId: m.id,
        clubId: m.clubId,
        title: m.club.title,
        role: m.role,
        status: m.status,
      })),
    };
  } catch (error) {
    // Expired or revoked token: behave as signed out
    if (error instanceof GraphQLRequestError && error.code === "UNAUTHENTICATED") {
      return null;
    }
    throw error;
  }
});

const CLUB_ROLE_RANK: Record<ClubRole, number> = { MEMBER: 1, HOST: 2, ADMIN: 3 };

/** The user's active role in a club; platform admins act as club admins. */
export function clubRole(user: SessionUser | null, clubId: number): ClubRole | null {
  if (user?.role === "ADMIN") {
    return "ADMIN";
  }
  const membership = user?.clubs.find((m) => m.clubId === clubId && m.status === "ACTIVE");
  return membership?.role ?? null;
}

export function hasClubRole(user: SessionUser | null, clubId: number, role: ClubRole): boolean {
  const current = clubRole(user, clubId);
  return current !== null && CLUB_ROLE_RANK[current] >= CLUB_ROLE_RANK[role];
}

/** Clubs whose games the user may run. */
export function hostedClubs(user: SessionUser | null): SessionMembership[] {
  return (user?.clubs ?? []).filter((m) => m.status === "ACTIVE" && m.role !== "MEMBER");
}

/** Platform hosts run games without a club; club hosts run their club's games. */
export function isPlatformHost(user: SessionUser | null): boolean {
  return user?.role === "HOST" || user?.role === "ADMIN";
}

export function isHost(user: SessionUser | null): boolean {
  return isPlatformHost(user) || hostedClubs(user).length > 0;
}
