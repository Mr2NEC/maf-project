/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      accessToken\n      role\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signup(input: $input) {\n      id\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  query Me {\n    me {\n      id\n      username\n      email\n      role\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation CreateGame($data: CreateGameInput!) {\n    createGame(data: $data) {\n      id\n    }\n  }\n": typeof types.CreateGameDocument,
    "\n  mutation AddPlayer($gameId: Int!, $input: AddPlayerInput!) {\n    addPlayerToGame(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n": typeof types.AddPlayerDocument,
    "\n  mutation RemovePlayer($gameId: Int!, $playerId: Int!) {\n    removePlayerFromGame(gameId: $gameId, playerId: $playerId) {\n      id\n    }\n  }\n": typeof types.RemovePlayerDocument,
    "\n  mutation AssignRoles($gameId: Int!, $input: AssignRolesInput!) {\n    assignRoles(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n": typeof types.AssignRolesDocument,
    "\n  mutation StartGame($gameId: Int!) {\n    startGame(gameId: $gameId) {\n      id\n    }\n  }\n": typeof types.StartGameDocument,
    "\n  mutation RecordNightAction($gameId: Int!, $input: NightActionInput!) {\n    recordNightAction(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n": typeof types.RecordNightActionDocument,
    "\n  mutation RemoveNightAction($gameId: Int!, $actionId: Int!) {\n    removeNightAction(gameId: $gameId, actionId: $actionId)\n  }\n": typeof types.RemoveNightActionDocument,
    "\n  mutation EndNight($gameId: Int!) {\n    endNight(gameId: $gameId) {\n      killed {\n        seatNumber\n        username\n      }\n      saved {\n        seatNumber\n        username\n      }\n      blocked {\n        seatNumber\n        username\n      }\n      checks {\n        actor {\n          seatNumber\n          username\n        }\n        target {\n          seatNumber\n          username\n        }\n        team\n      }\n      game {\n        status\n        winnerTeam\n      }\n    }\n  }\n": typeof types.EndNightDocument,
    "\n  mutation EndDay($gameId: Int!, $input: EndDayInput!) {\n    endDay(gameId: $gameId, input: $input) {\n      tie\n      tiedPlayers {\n        id\n        seatNumber\n        username\n      }\n      eliminated {\n        seatNumber\n        username\n      }\n      game {\n        status\n        winnerTeam\n      }\n    }\n  }\n": typeof types.EndDayDocument,
    "\n  mutation AddFoul($gameId: Int!, $playerId: Int!) {\n    addFoul(gameId: $gameId, playerId: $playerId) {\n      id\n    }\n  }\n": typeof types.AddFoulDocument,
    "\n  mutation CancelGame($gameId: Int!) {\n    cancelGame(gameId: $gameId) {\n      id\n    }\n  }\n": typeof types.CancelGameDocument,
    "\n  mutation AwardBonus($gameId: Int!, $input: AwardBonusInput!) {\n    awardBonus(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n": typeof types.AwardBonusDocument,
    "\n  query HostGames {\n    active: games(statuses: [WAITING, IN_PROGRESS], take: 100) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n    }\n    finished: games(statuses: [FINISHED], take: 10) {\n      id\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n    gameTypes {\n      id\n      name\n      playersCount\n    }\n  }\n": typeof types.HostGamesDocument,
    "\n  query HostGame($id: Float!) {\n    game(id: $id) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      winnerTeam\n      gameType {\n        id\n        name\n        playersCount\n        maxFouls\n        gameTypeRoles {\n          count\n          role {\n            id\n            name\n            team\n          }\n        }\n      }\n      players {\n        id\n        userId\n        seatNumber\n        username\n        status\n        fouls\n        points\n        eliminatedRound\n        role {\n          id\n          name\n          team\n        }\n      }\n    }\n    roles {\n      id\n      actions {\n        actionType {\n          id\n          name\n          effect\n          phase\n        }\n      }\n    }\n  }\n": typeof types.HostGameDocument,
    "\n  query NightActions($gameId: Int!) {\n    actions(gameId: $gameId, take: 100) {\n      id\n      round\n      phase\n      actorId\n      actionType {\n        name\n        effect\n      }\n      targets {\n        targetId\n      }\n    }\n  }\n": typeof types.NightActionsDocument,
    "\n  query SearchUsers($search: String!) {\n    users(search: $search, take: 10) {\n      id\n      username\n    }\n  }\n": typeof types.SearchUsersDocument,
};
const documents: Documents = {
    "\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      accessToken\n      role\n    }\n  }\n": types.SignInDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signup(input: $input) {\n      id\n    }\n  }\n": types.SignUpDocument,
    "\n  query Me {\n    me {\n      id\n      username\n      email\n      role\n    }\n  }\n": types.MeDocument,
    "\n  mutation CreateGame($data: CreateGameInput!) {\n    createGame(data: $data) {\n      id\n    }\n  }\n": types.CreateGameDocument,
    "\n  mutation AddPlayer($gameId: Int!, $input: AddPlayerInput!) {\n    addPlayerToGame(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n": types.AddPlayerDocument,
    "\n  mutation RemovePlayer($gameId: Int!, $playerId: Int!) {\n    removePlayerFromGame(gameId: $gameId, playerId: $playerId) {\n      id\n    }\n  }\n": types.RemovePlayerDocument,
    "\n  mutation AssignRoles($gameId: Int!, $input: AssignRolesInput!) {\n    assignRoles(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n": types.AssignRolesDocument,
    "\n  mutation StartGame($gameId: Int!) {\n    startGame(gameId: $gameId) {\n      id\n    }\n  }\n": types.StartGameDocument,
    "\n  mutation RecordNightAction($gameId: Int!, $input: NightActionInput!) {\n    recordNightAction(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n": types.RecordNightActionDocument,
    "\n  mutation RemoveNightAction($gameId: Int!, $actionId: Int!) {\n    removeNightAction(gameId: $gameId, actionId: $actionId)\n  }\n": types.RemoveNightActionDocument,
    "\n  mutation EndNight($gameId: Int!) {\n    endNight(gameId: $gameId) {\n      killed {\n        seatNumber\n        username\n      }\n      saved {\n        seatNumber\n        username\n      }\n      blocked {\n        seatNumber\n        username\n      }\n      checks {\n        actor {\n          seatNumber\n          username\n        }\n        target {\n          seatNumber\n          username\n        }\n        team\n      }\n      game {\n        status\n        winnerTeam\n      }\n    }\n  }\n": types.EndNightDocument,
    "\n  mutation EndDay($gameId: Int!, $input: EndDayInput!) {\n    endDay(gameId: $gameId, input: $input) {\n      tie\n      tiedPlayers {\n        id\n        seatNumber\n        username\n      }\n      eliminated {\n        seatNumber\n        username\n      }\n      game {\n        status\n        winnerTeam\n      }\n    }\n  }\n": types.EndDayDocument,
    "\n  mutation AddFoul($gameId: Int!, $playerId: Int!) {\n    addFoul(gameId: $gameId, playerId: $playerId) {\n      id\n    }\n  }\n": types.AddFoulDocument,
    "\n  mutation CancelGame($gameId: Int!) {\n    cancelGame(gameId: $gameId) {\n      id\n    }\n  }\n": types.CancelGameDocument,
    "\n  mutation AwardBonus($gameId: Int!, $input: AwardBonusInput!) {\n    awardBonus(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n": types.AwardBonusDocument,
    "\n  query HostGames {\n    active: games(statuses: [WAITING, IN_PROGRESS], take: 100) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n    }\n    finished: games(statuses: [FINISHED], take: 10) {\n      id\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n    gameTypes {\n      id\n      name\n      playersCount\n    }\n  }\n": types.HostGamesDocument,
    "\n  query HostGame($id: Float!) {\n    game(id: $id) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      winnerTeam\n      gameType {\n        id\n        name\n        playersCount\n        maxFouls\n        gameTypeRoles {\n          count\n          role {\n            id\n            name\n            team\n          }\n        }\n      }\n      players {\n        id\n        userId\n        seatNumber\n        username\n        status\n        fouls\n        points\n        eliminatedRound\n        role {\n          id\n          name\n          team\n        }\n      }\n    }\n    roles {\n      id\n      actions {\n        actionType {\n          id\n          name\n          effect\n          phase\n        }\n      }\n    }\n  }\n": types.HostGameDocument,
    "\n  query NightActions($gameId: Int!) {\n    actions(gameId: $gameId, take: 100) {\n      id\n      round\n      phase\n      actorId\n      actionType {\n        name\n        effect\n      }\n      targets {\n        targetId\n      }\n    }\n  }\n": types.NightActionsDocument,
    "\n  query SearchUsers($search: String!) {\n    users(search: $search, take: 10) {\n      id\n      username\n    }\n  }\n": types.SearchUsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      accessToken\n      role\n    }\n  }\n"): typeof import('./graphql').SignInDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignUp($input: SignUpInput!) {\n    signup(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').SignUpDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      username\n      email\n      role\n    }\n  }\n"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateGame($data: CreateGameInput!) {\n    createGame(data: $data) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateGameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddPlayer($gameId: Int!, $input: AddPlayerInput!) {\n    addPlayerToGame(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddPlayerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemovePlayer($gameId: Int!, $playerId: Int!) {\n    removePlayerFromGame(gameId: $gameId, playerId: $playerId) {\n      id\n    }\n  }\n"): typeof import('./graphql').RemovePlayerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AssignRoles($gameId: Int!, $input: AssignRolesInput!) {\n    assignRoles(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').AssignRolesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartGame($gameId: Int!) {\n    startGame(gameId: $gameId) {\n      id\n    }\n  }\n"): typeof import('./graphql').StartGameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RecordNightAction($gameId: Int!, $input: NightActionInput!) {\n    recordNightAction(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').RecordNightActionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveNightAction($gameId: Int!, $actionId: Int!) {\n    removeNightAction(gameId: $gameId, actionId: $actionId)\n  }\n"): typeof import('./graphql').RemoveNightActionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EndNight($gameId: Int!) {\n    endNight(gameId: $gameId) {\n      killed {\n        seatNumber\n        username\n      }\n      saved {\n        seatNumber\n        username\n      }\n      blocked {\n        seatNumber\n        username\n      }\n      checks {\n        actor {\n          seatNumber\n          username\n        }\n        target {\n          seatNumber\n          username\n        }\n        team\n      }\n      game {\n        status\n        winnerTeam\n      }\n    }\n  }\n"): typeof import('./graphql').EndNightDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EndDay($gameId: Int!, $input: EndDayInput!) {\n    endDay(gameId: $gameId, input: $input) {\n      tie\n      tiedPlayers {\n        id\n        seatNumber\n        username\n      }\n      eliminated {\n        seatNumber\n        username\n      }\n      game {\n        status\n        winnerTeam\n      }\n    }\n  }\n"): typeof import('./graphql').EndDayDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddFoul($gameId: Int!, $playerId: Int!) {\n    addFoul(gameId: $gameId, playerId: $playerId) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddFoulDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelGame($gameId: Int!) {\n    cancelGame(gameId: $gameId) {\n      id\n    }\n  }\n"): typeof import('./graphql').CancelGameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AwardBonus($gameId: Int!, $input: AwardBonusInput!) {\n    awardBonus(gameId: $gameId, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').AwardBonusDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HostGames {\n    active: games(statuses: [WAITING, IN_PROGRESS], take: 100) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n    }\n    finished: games(statuses: [FINISHED], take: 10) {\n      id\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n    gameTypes {\n      id\n      name\n      playersCount\n    }\n  }\n"): typeof import('./graphql').HostGamesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HostGame($id: Float!) {\n    game(id: $id) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      winnerTeam\n      gameType {\n        id\n        name\n        playersCount\n        maxFouls\n        gameTypeRoles {\n          count\n          role {\n            id\n            name\n            team\n          }\n        }\n      }\n      players {\n        id\n        userId\n        seatNumber\n        username\n        status\n        fouls\n        points\n        eliminatedRound\n        role {\n          id\n          name\n          team\n        }\n      }\n    }\n    roles {\n      id\n      actions {\n        actionType {\n          id\n          name\n          effect\n          phase\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').HostGameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NightActions($gameId: Int!) {\n    actions(gameId: $gameId, take: 100) {\n      id\n      round\n      phase\n      actorId\n      actionType {\n        name\n        effect\n      }\n      targets {\n        targetId\n      }\n    }\n  }\n"): typeof import('./graphql').NightActionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchUsers($search: String!) {\n    users(search: $search, take: 10) {\n      id\n      username\n    }\n  }\n"): typeof import('./graphql').SearchUsersDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
