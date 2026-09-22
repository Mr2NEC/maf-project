import "server-only";

import { cookies, headers } from "next/headers";
import type { TypedDocumentString } from "@/gql/graphql";

export const SESSION_COOKIE = "maf_session";

const API_URL = process.env.API_URL ?? "http://localhost:4000/graphql";

/** A GraphQL error with the stable code from the backend (see format-error.ts). */
export class GraphQLRequestError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: string[]
  ) {
    super(message);
    this.name = "GraphQLRequestError";
  }
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: {
    message: string;
    extensions?: { code?: string; details?: string[] };
  }[];
};

/**
 * Runs a query or mutation from the Next.js server. The session token is read
 * from the httpOnly cookie, so it never reaches the browser. The visitor IP is
 * forwarded so the API rate limits per visitor, not per frontend server.
 */
export async function request<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<TResult> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const forwardedFor = (await headers()).get("x-forwarded-for");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token && { authorization: `Bearer ${token}` }),
      ...(forwardedFor && { "x-forwarded-for": forwardedFor }),
    },
    body: JSON.stringify({ query: document.toString(), variables }),
    cache: "no-store",
  });

  const body = (await response.json()) as GraphQLResponse<TResult>;
  const error = body.errors?.[0];
  if (error) {
    throw new GraphQLRequestError(
      error.message,
      error.extensions?.code ?? "INTERNAL_SERVER_ERROR",
      error.extensions?.details
    );
  }
  if (!body.data) {
    throw new GraphQLRequestError("Empty response", "INTERNAL_SERVER_ERROR");
  }
  return body.data;
}
