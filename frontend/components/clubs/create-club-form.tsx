"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Alert, Button, Input, Label } from "@/components/ui";
import { createClub } from "@/lib/clubs/actions";

export function CreateClubForm() {
  const t = useTranslations("clubs");
  const [state, action, pending] = useActionState(createClub, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">{t("name")}</Label>
        <Input id="title" name="title" required minLength={2} maxLength={100} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="region">{t("region")}</Label>
        <Input id="region" name="region" required minLength={2} maxLength={100} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">{t("description")}</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={5000}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      {state && !state.ok && <Alert variant="destructive">{state.error}</Alert>}
      <Button type="submit" disabled={pending}>
        {t("create")}
      </Button>
    </form>
  );
}
