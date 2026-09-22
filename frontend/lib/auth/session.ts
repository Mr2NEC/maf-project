import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { graphql } from "@/gql";
import type { UserRole } from "@/gql/graphql";
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
  }
`);

export type SessionUser = {
  id: string;
  username: string;
  email?: string | null;
  role: UserRole;
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
    return (await request(MeQuery)).me;
  } catch (error) {
    // Expired or revoked token: behave as signed out
    if (error instanceof GraphQLRequestError && error.code === "UNAUTHENTICATED") {
      return null;
    }
    throw error;
  }
});

export function isHost(user: SessionUser | null): boolean {
  return user?.role === "HOST" || user?.role === "ADMIN";
}
