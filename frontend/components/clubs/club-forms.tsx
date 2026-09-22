"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Alert, Button, Input, Label } from "@/components/ui";
import type { RatingRulesInput as RatingRules } from "@/gql/graphql";
import type { HostActionResult as ActionResult } from "@/lib/host/actions";

type FormAction = (state: ActionResult | null, form: FormData) => Promise<ActionResult>;

const textareaClass = "rounded-md border border-input bg-background px-3 py-2 text-sm";

function Result({ state, saved }: { state: ActionResult | null; saved?: string }) {
  if (!state) {
    return null;
  }
  return state.ok ? (
    saved ? <p className="text-sm text-muted-foreground">{saved}</p> : null
  ) : (
    <Alert variant="destructive">{state.error}</Alert>
  );
}

export function ClubInfoForm({
  action,
  club,
}: {
  action: FormAction;
  club: { title: string; region: string; description?: string | null };
}) {
  const t = useTranslations("clubs");
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">{t("name")}</Label>
        <Input id="title" name="title" required minLength={2} maxLength={100} defaultValue={club.title} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="region">{t("region")}</Label>
        <Input id="region" name="region" required minLength={2} maxLength={100} defaultValue={club.region} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">{t("description")}</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={5000}
          defaultValue={club.description ?? ""}
          className={textareaClass}
        />
      </div>
      <Result state={state} saved={t("saved")} />
      <Button type="submit" disabled={pending} className="self-start">
        {t("save")}
      </Button>
    </form>
  );
}

const POINT_FIELDS = ["townWinPoints", "mafiaWinPoints", "neutralWinPoints", "lossPoints"] as const;

export function RatingRulesForm({
  action,
  rules,
}: {
  action: FormAction;
  rules: RatingRules;
}) {
  const t = useTranslations("rating-rules");
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {POINT_FIELDS.map((field) => (
          <div key={field} className="flex flex-col gap-2">
            <Label htmlFor={field}>{t(`fields.${field}`)}</Label>
            <Input
              id={field}
              name={field}
              type="number"
              step="0.05"
              min={-10}
              max={10}
              required
              defaultValue={rules[field]}
            />
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <Label htmlFor="minGames">{t("fields.minGames")}</Label>
          <Input id="minGames" name="minGames" type="number" step="1" min={0} max={1000} required defaultValue={rules.minGames} />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" name="bonusEnabled" defaultChecked={rules.bonusEnabled} className="size-4" />
          {t("fields.bonusEnabled")}
        </label>
      </div>
      <p className="text-sm text-muted-foreground">{t("recalculate-hint")}</p>
      <Result state={state} saved={t("saved")} />
      <Button type="submit" disabled={pending} className="self-start">
        {t("save")}
      </Button>
    </form>
  );
}

export function CreateTournamentForm({ action }: { action: FormAction }) {
  const t = useTranslations("tournaments");
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" required minLength={2} maxLength={150} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startDate">{t("start-date")}</Label>
          <Input id="startDate" name="startDate" type="date" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="endDate">{t("end-date")}</Label>
          <Input id="endDate" name="endDate" type="date" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tournament-description">{t("description")}</Label>
        <textarea id="tournament-description" name="description" rows={3} maxLength={5000} className={textareaClass} />
      </div>
      <Result state={state} />
      <Button type="submit" disabled={pending} className="self-start">
        {t("create")}
      </Button>
    </form>
  );
}
