import type { HostGameQuery, NightActionsQuery } from "@/gql/graphql";

export type HostGame = NonNullable<HostGameQuery["game"]>;
export type HostPlayer = HostGame["players"][number];
export type HostRoles = HostGameQuery["roles"];
export type HostAction = NightActionsQuery["actions"][number];

export const seatLabel = (player: { seatNumber?: number | null; username: string }) =>
  `${player.seatNumber ?? "?"}. ${player.username}`;

export const isAlive = (player: HostPlayer) => player.status === "ALIVE";
