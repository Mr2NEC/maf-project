import type { EndDayMutation, EndNightMutation } from "@/gql/graphql";

/** What the host saw happen, kept on screen after the phase changes. */
export type GameEvent =
  | { kind: "night"; round: number; result: EndNightMutation["endNight"] }
  | { kind: "day"; round: number; result: EndDayMutation["endDay"] };
