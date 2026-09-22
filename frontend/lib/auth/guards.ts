import "server-only";

import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser, isHost, type SessionUser } from "./session";

/** For host pages and commands: sends everyone else to the sign-in page. */
export async function requireHost(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || !isHost(user)) {
    redirect({ href: "/login", locale: await getLocale() });
  }
  return user as SessionUser;
}

/** For pages and commands that need any signed-in user. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: "/login", locale: await getLocale() });
  }
  return user as SessionUser;
}
