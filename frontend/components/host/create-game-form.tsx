"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { Alert, Button, Input, Label, Select } from "@/components/ui";
import { createGame } from "@/lib/host/actions";

type Props = {
  gameTypes: { id: string; name: string; playersCount: number }[];
  /** Where the game is played: a club, a club's tournament or no club. */
  places: { value: string; label: string }[];
};

/** Next full hour in the local zone, formatted for datetime-local. */
function nextHour(): string {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`;
}

export function CreateGameForm({ gameTypes, places }: Props) {
  const t = useTranslations("host");
  const [state, action, pending] = useActionState(createGame, null);
  // Computed in the browser: the server does not know the host's time zone
  const [startDate, setStartDate] = useState("");
  useEffect(() => setStartDate(nextHour()), []);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="where">{t("where")}</Label>
        <Select id="where" name="where">
          {places.map((place) => (
            <option key={place.value} value={place.value}>
              {place.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="gameTypeId">{t("game-type")}</Label>
        <Select id="gameTypeId" name="gameTypeId" required>
          {gameTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="startDate">{t("start-date")}</Label>
        <Input
          id="startDate"
          name="startDate"
          type="datetime-local"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      {state && !state.ok && <Alert variant="destructive">{state.error}</Alert>}
      <Button type="submit" disabled={pending}>
        {t("create-game")}
      </Button>
    </form>
  );
}
