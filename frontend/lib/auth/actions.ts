"use server";

import { getLocale } from "next-intl/server";
import { graphql } from "@/gql";
import { redirect } from "@/i18n/navigation";
import { GraphQLRequestError, request } from "@/lib/graphql/client";
import { endSession, startSession } from "./session";

const SignInMutation = graphql(`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      accessToken
      role
    }
  }
`);

const SignUpMutation = graphql(`
  mutation SignUp($input: SignUpInput!) {
    signup(input: $input) {
      id
    }
  }
`);

export type AuthError =
  | "invalid_credentials"
  | "email_taken"
  | "invalid_input"
  | "too_many_requests"
  | "unknown";

export type AuthFormState = { error?: AuthError; details?: string[] };

function toAuthError(error: unknown): AuthFormState {
  if (!(error instanceof GraphQLRequestError)) {
    return { error: "unknown" };
  }
  switch (error.code) {
    case "UNAUTHENTICATED":
      return { error: "invalid_credentials" };
    case "CONFLICT":
      return { error: "email_taken" };
    case "BAD_REQUEST":
      return { error: "invalid_input", details: error.details };
    case "TOO_MANY_REQUESTS":
      return { error: "too_many_requests" };
    default:
      return { error: "unknown" };
  }
}

async function signInWith(email: string, password: string): Promise<string> {
  const { signIn } = await request(SignInMutation, {
    input: { email, password },
  });
  await startSession(signIn.accessToken);
  return signIn.role === "HOST" || signIn.role === "ADMIN" ? "/host" : "/";
}

export async function signInAction(
  _state: AuthFormState,
  form: FormData
): Promise<AuthFormState> {
  let target: string;
  try {
    target = await signInWith(String(form.get("email")), String(form.get("password")));
  } catch (error) {
    return toAuthError(error);
  }
  // redirect() throws, so it must stay outside try/catch
  redirect({ href: target as "/host" | "/", locale: await getLocale() });
  return {};
}

export async function signUpAction(
  _state: AuthFormState,
  form: FormData
): Promise<AuthFormState> {
  const email = String(form.get("email"));
  const password = String(form.get("password"));
  try {
    await request(SignUpMutation, {
      input: { username: String(form.get("username")), email, password },
    });
    await signInWith(email, password);
  } catch (error) {
    return toAuthError(error);
  }
  redirect({ href: "/", locale: await getLocale() });
  return {};
}

export async function signOutAction(): Promise<void> {
  await endSession();
  redirect({ href: "/", locale: await getLocale() });
}
