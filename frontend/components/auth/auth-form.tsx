"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Alert, Button, Input, Label } from "@/components/ui";
import type { AuthFormState } from "@/lib/auth/actions";

type AuthFormProps = {
  mode: "login" | "register";
  action: (state: AuthFormState, form: FormData) => Promise<AuthFormState>;
};

export function AuthForm({ mode, action }: AuthFormProps) {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      {mode === "register" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">{t("username")}</Label>
          <Input id="username" name="username" required minLength={2} maxLength={50} autoComplete="nickname" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        {mode === "register" && (
          <p className="text-xs text-muted-foreground">{t("password-hint")}</p>
        )}
      </div>

      {state.error && (
        <Alert variant="destructive">
          {t(`errors.${state.error}`)}
          {state.details && (
            <ul className="mt-1 list-disc pl-4">
              {state.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}
        </Alert>
      )}

      <Button type="submit" disabled={pending}>
        {t(mode === "login" ? "sign-in" : "sign-up")}
      </Button>
    </form>
  );
}
