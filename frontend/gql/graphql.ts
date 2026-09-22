/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type ActionEffect =
  | 'BLOCK'
  | 'CHECK'
  | 'HEAL'
  | 'KILL'
  | 'NOTE'
  | 'VOTE';

export type AddPlayerInput = {
  seatNumber?: number | null | undefined;
  userId: number;
};

export type AssignRolesInput = {
  assignments?: Array<RoleAssignmentInput> | null | undefined;
  random?: boolean;
};

export type AwardBonusInput = {
  playerId: number;
  points: number;
};

export type CreateGameInput = {
  gameTypeId: number;
  startDate: string;
};

export type EndDayInput = {
  tieBreak?: TieBreak | null | undefined;
  votes: Array<VoteInput>;
};

export type GamePhase =
  | 'DAY'
  | 'NIGHT';

/** The status of a game */
export type GameStatus =
  | 'CANCELLED'
  | 'FINISHED'
  | 'IN_PROGRESS'
  | 'WAITING';

export type NightActionInput = {
  actionTypeId: number;
  actorId: number;
  targetId: number;
};

export type PlayerStatus =
  | 'ALIVE'
  | 'DISQUALIFIED'
  | 'KILLED'
  | 'VOTED_OUT';

export type RoleAssignmentInput = {
  playerId: number;
  roleId: number;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  username: string;
};

export type Team =
  | 'MAFIA'
  | 'NEUTRAL'
  | 'TOWN';

/** How to settle a tie in the day vote */
export type TieBreak =
  | 'ELIMINATE_ALL'
  | 'KEEP_ALL';

/** The role of a user */
export type UserRole =
  | 'ADMIN'
  | 'HOST'
  | 'USER';

export type VoteInput = {
  targetId: number;
  voterIds: Array<number>;
};

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { signIn: { accessToken: string, role: UserRole } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { signup: { id: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, username: string, email: string | null, role: UserRole } };

export type CreateGameMutationVariables = Exact<{
  data: CreateGameInput;
}>;


export type CreateGameMutation = { createGame: { id: string } };

export type AddPlayerMutationVariables = Exact<{
  gameId: number;
  input: AddPlayerInput;
}>;


export type AddPlayerMutation = { addPlayerToGame: { id: string } };

export type RemovePlayerMutationVariables = Exact<{
  gameId: number;
  playerId: number;
}>;


export type RemovePlayerMutation = { removePlayerFromGame: { id: string } };

export type AssignRolesMutationVariables = Exact<{
  gameId: number;
  input: AssignRolesInput;
}>;


export type AssignRolesMutation = { assignRoles: { id: string } };

export type StartGameMutationVariables = Exact<{
  gameId: number;
}>;


export type StartGameMutation = { startGame: { id: string } };

export type RecordNightActionMutationVariables = Exact<{
  gameId: number;
  input: NightActionInput;
}>;


export type RecordNightActionMutation = { recordNightAction: { id: string } };

export type RemoveNightActionMutationVariables = Exact<{
  gameId: number;
  actionId: number;
}>;


export type RemoveNightActionMutation = { removeNightAction: boolean };

export type EndNightMutationVariables = Exact<{
  gameId: number;
}>;


export type EndNightMutation = { endNight: { killed: Array<{ seatNumber: number | null, username: string }>, saved: Array<{ seatNumber: number | null, username: string }>, blocked: Array<{ seatNumber: number | null, username: string }>, checks: Array<{ team: Team | null, actor: { seatNumber: number | null, username: string }, target: { seatNumber: number | null, username: string } }>, game: { status: GameStatus, winnerTeam: Team | null } } };

export type EndDayMutationVariables = Exact<{
  gameId: number;
  input: EndDayInput;
}>;


export type EndDayMutation = { endDay: { tie: boolean, tiedPlayers: Array<{ id: string, seatNumber: number | null, username: string }>, eliminated: Array<{ seatNumber: number | null, username: string }>, game: { status: GameStatus, winnerTeam: Team | null } } };

export type AddFoulMutationVariables = Exact<{
  gameId: number;
  playerId: number;
}>;


export type AddFoulMutation = { addFoul: { id: string } };

export type CancelGameMutationVariables = Exact<{
  gameId: number;
}>;


export type CancelGameMutation = { cancelGame: { id: string } };

export type AwardBonusMutationVariables = Exact<{
  gameId: number;
  input: AwardBonusInput;
}>;


export type AwardBonusMutation = { awardBonus: { id: string } };

export type HostGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type HostGamesQuery = { active: Array<{ id: string, status: GameStatus, phase: GamePhase | null, currentRound: number, startDate: string, gameType: { name: string, playersCount: number }, players: Array<{ id: string }> }>, finished: Array<{ id: string, startDate: string, winnerTeam: Team | null, gameType: { name: string } }>, gameTypes: Array<{ id: string, name: string, playersCount: number }> };

export type HostGameQueryVariables = Exact<{
  id: number;
}>;


export type HostGameQuery = { game: { id: string, status: GameStatus, phase: GamePhase | null, currentRound: number, startDate: string, winnerTeam: Team | null, gameType: { id: string, name: string, playersCount: number, maxFouls: number, gameTypeRoles: Array<{ count: number, role: { id: number, name: string, team: Team } }> }, players: Array<{ id: string, userId: number, seatNumber: number | null, username: string, status: PlayerStatus, fouls: number, points: number, eliminatedRound: number | null, role: { id: number, name: string, team: Team } | null }> }, roles: Array<{ id: number, actions: Array<{ actionType: { id: string, name: string, effect: ActionEffect, phase: GamePhase | null } }> }> };

export type NightActionsQueryVariables = Exact<{
  gameId: number;
}>;


export type NightActionsQuery = { actions: Array<{ id: string, round: number, phase: GamePhase, actorId: number, actionType: { name: string, effect: ActionEffect }, targets: Array<{ targetId: number }> | null }> };

export type SearchUsersQueryVariables = Exact<{
  search: string;
}>;


export type SearchUsersQuery = { users: Array<{ id: string, username: string }> };

export type UpcomingGamesQueryVariables = Exact<{
  from: string;
  take: number;
}>;


export type UpcomingGamesQuery = { games: Array<{ id: string, status: GameStatus, phase: GamePhase | null, currentRound: number, startDate: string, gameType: { name: string, playersCount: number }, players: Array<{ id: string }> }> };

export type RecentGamesQueryVariables = Exact<{
  take: number;
}>;


export type RecentGamesQuery = { games: Array<{ id: string, startDate: string, winnerTeam: Team | null, gameType: { name: string } }> };

export type PublicGameQueryVariables = Exact<{
  id: number;
}>;


export type PublicGameQuery = { game: { id: string, status: GameStatus, phase: GamePhase | null, currentRound: number, startDate: string, finishedAt: string | null, winnerTeam: Team | null, gameType: { name: string, playersCount: number }, players: Array<{ id: string, userId: number, seatNumber: number | null, username: string, status: PlayerStatus, fouls: number, points: number, eliminatedRound: number | null, role: { name: string, team: Team } | null }> } };

export type PlayersQueryVariables = Exact<{
  search?: string | null | undefined;
  skip: number;
  take: number;
}>;


export type PlayersQuery = { users: Array<{ id: string, username: string, createdAt: string, club: { title: string } | null }> };

export type PlayerProfileQueryVariables = Exact<{
  id: number;
}>;


export type PlayerProfileQuery = { user: { id: string, username: string, createdAt: string, profile: { firstName: string | null, lastName: string | null } | null, club: { title: string } | null, socials: Array<{ type: string, link: string }> }, players: Array<{ id: string, status: PlayerStatus, points: number, role: { name: string, team: Team } | null, game: { id: string, status: GameStatus, startDate: string, winnerTeam: Team | null, gameType: { name: string } } }> };

export type RatingQueryVariables = Exact<{
  from?: string | null | undefined;
  take: number;
}>;


export type RatingQuery = { rating: Array<{ place: number, points: number, games: number, wins: number, winRate: number, user: { id: string, username: string } }> };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const SignInDocument = new TypedDocumentString(`
    mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    accessToken
    role
  }
}
    `) as unknown as TypedDocumentString<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = new TypedDocumentString(`
    mutation SignUp($input: SignUpInput!) {
  signup(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<SignUpMutation, SignUpMutationVariables>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    id
    username
    email
    role
  }
}
    `) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const CreateGameDocument = new TypedDocumentString(`
    mutation CreateGame($data: CreateGameInput!) {
  createGame(data: $data) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateGameMutation, CreateGameMutationVariables>;
export const AddPlayerDocument = new TypedDocumentString(`
    mutation AddPlayer($gameId: Int!, $input: AddPlayerInput!) {
  addPlayerToGame(gameId: $gameId, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AddPlayerMutation, AddPlayerMutationVariables>;
export const RemovePlayerDocument = new TypedDocumentString(`
    mutation RemovePlayer($gameId: Int!, $playerId: Int!) {
  removePlayerFromGame(gameId: $gameId, playerId: $playerId) {
    id
  }
}
    `) as unknown as TypedDocumentString<RemovePlayerMutation, RemovePlayerMutationVariables>;
export const AssignRolesDocument = new TypedDocumentString(`
    mutation AssignRoles($gameId: Int!, $input: AssignRolesInput!) {
  assignRoles(gameId: $gameId, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AssignRolesMutation, AssignRolesMutationVariables>;
export const StartGameDocument = new TypedDocumentString(`
    mutation StartGame($gameId: Int!) {
  startGame(gameId: $gameId) {
    id
  }
}
    `) as unknown as TypedDocumentString<StartGameMutation, StartGameMutationVariables>;
export const RecordNightActionDocument = new TypedDocumentString(`
    mutation RecordNightAction($gameId: Int!, $input: NightActionInput!) {
  recordNightAction(gameId: $gameId, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<RecordNightActionMutation, RecordNightActionMutationVariables>;
export const RemoveNightActionDocument = new TypedDocumentString(`
    mutation RemoveNightAction($gameId: Int!, $actionId: Int!) {
  removeNightAction(gameId: $gameId, actionId: $actionId)
}
    `) as unknown as TypedDocumentString<RemoveNightActionMutation, RemoveNightActionMutationVariables>;
export const EndNightDocument = new TypedDocumentString(`
    mutation EndNight($gameId: Int!) {
  endNight(gameId: $gameId) {
    killed {
      seatNumber
      username
    }
    saved {
      seatNumber
      username
    }
    blocked {
      seatNumber
      username
    }
    checks {
      actor {
        seatNumber
        username
      }
      target {
        seatNumber
        username
      }
      team
    }
    game {
      status
      winnerTeam
    }
  }
}
    `) as unknown as TypedDocumentString<EndNightMutation, EndNightMutationVariables>;
export const EndDayDocument = new TypedDocumentString(`
    mutation EndDay($gameId: Int!, $input: EndDayInput!) {
  endDay(gameId: $gameId, input: $input) {
    tie
    tiedPlayers {
      id
      seatNumber
      username
    }
    eliminated {
      seatNumber
      username
    }
    game {
      status
      winnerTeam
    }
  }
}
    `) as unknown as TypedDocumentString<EndDayMutation, EndDayMutationVariables>;
export const AddFoulDocument = new TypedDocumentString(`
    mutation AddFoul($gameId: Int!, $playerId: Int!) {
  addFoul(gameId: $gameId, playerId: $playerId) {
    id
  }
}
    `) as unknown as TypedDocumentString<AddFoulMutation, AddFoulMutationVariables>;
export const CancelGameDocument = new TypedDocumentString(`
    mutation CancelGame($gameId: Int!) {
  cancelGame(gameId: $gameId) {
    id
  }
}
    `) as unknown as TypedDocumentString<CancelGameMutation, CancelGameMutationVariables>;
export const AwardBonusDocument = new TypedDocumentString(`
    mutation AwardBonus($gameId: Int!, $input: AwardBonusInput!) {
  awardBonus(gameId: $gameId, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AwardBonusMutation, AwardBonusMutationVariables>;
export const HostGamesDocument = new TypedDocumentString(`
    query HostGames {
  active: games(statuses: [WAITING, IN_PROGRESS], take: 100) {
    id
    status
    phase
    currentRound
    startDate
    gameType {
      name
      playersCount
    }
    players {
      id
    }
  }
  finished: games(statuses: [FINISHED], take: 10) {
    id
    startDate
    winnerTeam
    gameType {
      name
    }
  }
  gameTypes {
    id
    name
    playersCount
  }
}
    `) as unknown as TypedDocumentString<HostGamesQuery, HostGamesQueryVariables>;
export const HostGameDocument = new TypedDocumentString(`
    query HostGame($id: Float!) {
  game(id: $id) {
    id
    status
    phase
    currentRound
    startDate
    winnerTeam
    gameType {
      id
      name
      playersCount
      maxFouls
      gameTypeRoles {
        count
        role {
          id
          name
          team
        }
      }
    }
    players {
      id
      userId
      seatNumber
      username
      status
      fouls
      points
      eliminatedRound
      role {
        id
        name
        team
      }
    }
  }
  roles {
    id
    actions {
      actionType {
        id
        name
        effect
        phase
      }
    }
  }
}
    `) as unknown as TypedDocumentString<HostGameQuery, HostGameQueryVariables>;
export const NightActionsDocument = new TypedDocumentString(`
    query NightActions($gameId: Int!) {
  actions(gameId: $gameId, take: 100) {
    id
    round
    phase
    actorId
    actionType {
      name
      effect
    }
    targets {
      targetId
    }
  }
}
    `) as unknown as TypedDocumentString<NightActionsQuery, NightActionsQueryVariables>;
export const SearchUsersDocument = new TypedDocumentString(`
    query SearchUsers($search: String!) {
  users(search: $search, take: 10) {
    id
    username
  }
}
    `) as unknown as TypedDocumentString<SearchUsersQuery, SearchUsersQueryVariables>;
export const UpcomingGamesDocument = new TypedDocumentString(`
    query UpcomingGames($from: DateTime!, $take: Int!) {
  games(statuses: [WAITING, IN_PROGRESS], from: $from, take: $take) {
    id
    status
    phase
    currentRound
    startDate
    gameType {
      name
      playersCount
    }
    players {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<UpcomingGamesQuery, UpcomingGamesQueryVariables>;
export const RecentGamesDocument = new TypedDocumentString(`
    query RecentGames($take: Int!) {
  games(statuses: [FINISHED], take: $take) {
    id
    startDate
    winnerTeam
    gameType {
      name
    }
  }
}
    `) as unknown as TypedDocumentString<RecentGamesQuery, RecentGamesQueryVariables>;
export const PublicGameDocument = new TypedDocumentString(`
    query PublicGame($id: Float!) {
  game(id: $id) {
    id
    status
    phase
    currentRound
    startDate
    finishedAt
    winnerTeam
    gameType {
      name
      playersCount
    }
    players {
      id
      userId
      seatNumber
      username
      status
      fouls
      points
      eliminatedRound
      role {
        name
        team
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicGameQuery, PublicGameQueryVariables>;
export const PlayersDocument = new TypedDocumentString(`
    query Players($search: String, $skip: Int!, $take: Int!) {
  users(search: $search, skip: $skip, take: $take) {
    id
    username
    createdAt
    club {
      title
    }
  }
}
    `) as unknown as TypedDocumentString<PlayersQuery, PlayersQueryVariables>;
export const PlayerProfileDocument = new TypedDocumentString(`
    query PlayerProfile($id: Int!) {
  user(id: $id) {
    id
    username
    createdAt
    profile {
      firstName
      lastName
    }
    club {
      title
    }
    socials {
      type
      link
    }
  }
  players(userId: $id, take: 50) {
    id
    status
    points
    role {
      name
      team
    }
    game {
      id
      status
      startDate
      winnerTeam
      gameType {
        name
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PlayerProfileQuery, PlayerProfileQueryVariables>;
export const RatingDocument = new TypedDocumentString(`
    query Rating($from: DateTime, $take: Int!) {
  rating(from: $from, take: $take) {
    place
    points
    games
    wins
    winRate
    user {
      id
      username
    }
  }
}
    `) as unknown as TypedDocumentString<RatingQuery, RatingQueryVariables>;