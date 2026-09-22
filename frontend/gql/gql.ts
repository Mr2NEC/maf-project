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
    "\n  query ClubRules($id: Int!) {\n    club(id: $id) {\n      title\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n  }\n": typeof types.ClubRulesDocument,
    "\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      accessToken\n      role\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signup(input: $input) {\n      id\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  query Me {\n    me {\n      id\n      username\n      email\n      role\n    }\n    myClubs {\n      id\n      clubId\n      role\n      status\n      club {\n        title\n      }\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation CreateClub($input: CreateClubInput!) {\n    createClub(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateClubDocument,
    "\n  mutation UpdateClub($id: Int!, $input: UpdateClubInput!) {\n    updateClub(id: $id, input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateClubDocument,
    "\n  mutation UpdateRatingRules($clubId: Int!, $rules: RatingRulesInput!) {\n    updateRatingRules(clubId: $clubId, rules: $rules) {\n      id\n    }\n  }\n": typeof types.UpdateRatingRulesDocument,
    "\n  mutation JoinClub($clubId: Int!) {\n    joinClub(clubId: $clubId) {\n      id\n    }\n  }\n": typeof types.JoinClubDocument,
    "\n  mutation LeaveClub($clubId: Int!) {\n    leaveClub(clubId: $clubId)\n  }\n": typeof types.LeaveClubDocument,
    "\n  mutation ApproveClubMember($memberId: Int!) {\n    approveClubMember(memberId: $memberId) {\n      id\n    }\n  }\n": typeof types.ApproveClubMemberDocument,
    "\n  mutation SetClubMemberRole($memberId: Int!, $role: ClubRole!) {\n    setClubMemberRole(memberId: $memberId, role: $role) {\n      id\n    }\n  }\n": typeof types.SetClubMemberRoleDocument,
    "\n  mutation RemoveClubMember($memberId: Int!) {\n    removeClubMember(memberId: $memberId)\n  }\n": typeof types.RemoveClubMemberDocument,
    "\n  mutation CreateTournament($input: CreateTournamentInput!) {\n    createTournament(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateTournamentDocument,
    "\n  mutation UpdateTournament($id: Int!, $input: UpdateTournamentInput!) {\n    updateTournament(id: $id, input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateTournamentDocument,
    "\n  mutation DeleteTournament($id: Int!) {\n    deleteTournament(id: $id)\n  }\n": typeof types.DeleteTournamentDocument,
    "\n  mutation AddTournamentParticipant($tournamentId: Int!, $userId: Int!) {\n    addTournamentParticipant(tournamentId: $tournamentId, userId: $userId) {\n      id\n    }\n  }\n": typeof types.AddTournamentParticipantDocument,
    "\n  mutation RemoveTournamentParticipant($tournamentId: Int!, $userId: Int!) {\n    removeTournamentParticipant(tournamentId: $tournamentId, userId: $userId) {\n      id\n    }\n  }\n": typeof types.RemoveTournamentParticipantDocument,
    "\n  query Clubs($search: String) {\n    clubs(search: $search, take: 100) {\n      id\n      title\n      region\n      description\n    }\n  }\n": typeof types.ClubsDocument,
    "\n  query Club($id: Int!, $clubId: Int!, $from: DateTime!) {\n    club(id: $id) {\n      id\n      title\n      region\n      description\n      createdAt\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n    clubMembers(clubId: $clubId) {\n      id\n      role\n      user {\n        id\n        username\n      }\n    }\n    games(clubId: $clubId, statuses: [WAITING, IN_PROGRESS], from: $from, take: 10) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n    }\n    rating(clubId: $clubId, take: 10) {\n      place\n      points\n      games\n      wins\n      winRate\n      user {\n        id\n        username\n      }\n    }\n    tournaments(clubId: $clubId, take: 20) {\n      id\n      name\n      status\n      startDate\n      endDate\n    }\n  }\n": typeof types.ClubDocument,
    "\n  query ClubManage($id: Int!, $clubId: Int!) {\n    club(id: $id) {\n      id\n      title\n      region\n      description\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n    members: clubMembers(clubId: $clubId) {\n      id\n      role\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n    pending: clubMembers(clubId: $clubId, status: PENDING) {\n      id\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n": typeof types.ClubManageDocument,
    "\n  query Tournaments($clubId: Int, $statuses: [TournamentStatus!]) {\n    tournaments(clubId: $clubId, statuses: $statuses, take: 100) {\n      id\n      name\n      status\n      startDate\n      endDate\n      club {\n        id\n        title\n      }\n    }\n  }\n": typeof types.TournamentsDocument,
    "\n  query Tournament($id: Int!) {\n    tournament(id: $id) {\n      id\n      clubId\n      name\n      description\n      status\n      startDate\n      endDate\n      club {\n        id\n        title\n      }\n      standings {\n        place\n        points\n        games\n        wins\n        user {\n          id\n          username\n        }\n      }\n      participants {\n        id\n        user {\n          id\n          username\n        }\n      }\n      games {\n        id\n        status\n        phase\n        currentRound\n        startDate\n        winnerTeam\n        gameType {\n          name\n          playersCount\n        }\n        players {\n          id\n        }\n      }\n    }\n  }\n": typeof types.TournamentDocument,
    "\n  query OpenTournaments {\n    tournaments(statuses: [PLANNED, ACTIVE], take: 100) {\n      id\n      clubId\n      name\n    }\n  }\n": typeof types.OpenTournamentsDocument,
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
    "\n  query HostGames {\n    active: games(statuses: [WAITING, IN_PROGRESS], take: 100) {\n      id\n      clubId\n      club {\n        title\n      }\n      tournament {\n        name\n      }\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n    }\n    finished: games(statuses: [FINISHED], take: 30) {\n      id\n      clubId\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n    gameTypes {\n      id\n      name\n      playersCount\n    }\n    tournaments(statuses: [PLANNED, ACTIVE], take: 100) {\n      id\n      clubId\n      name\n    }\n  }\n": typeof types.HostGamesDocument,
    "\n  query HostGame($id: Float!) {\n    game(id: $id) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      winnerTeam\n      gameType {\n        id\n        name\n        playersCount\n        maxFouls\n        gameTypeRoles {\n          count\n          role {\n            id\n            name\n            team\n          }\n        }\n      }\n      players {\n        id\n        userId\n        seatNumber\n        username\n        status\n        fouls\n        points\n        eliminatedRound\n        role {\n          id\n          name\n          team\n        }\n      }\n    }\n    roles {\n      id\n      actions {\n        actionType {\n          id\n          name\n          effect\n          phase\n        }\n      }\n    }\n  }\n": typeof types.HostGameDocument,
    "\n  query NightActions($gameId: Int!) {\n    actions(gameId: $gameId, take: 100) {\n      id\n      round\n      phase\n      actorId\n      actionType {\n        name\n        effect\n      }\n      targets {\n        targetId\n      }\n    }\n  }\n": typeof types.NightActionsDocument,
    "\n  query SearchUsers($search: String!) {\n    users(search: $search, take: 10) {\n      id\n      username\n    }\n  }\n": typeof types.SearchUsersDocument,
    "\n  query UpcomingGames($from: DateTime!, $take: Int!) {\n    games(statuses: [WAITING, IN_PROGRESS], from: $from, take: $take) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n    }\n  }\n": typeof types.UpcomingGamesDocument,
    "\n  query RecentGames($take: Int!) {\n    games(statuses: [FINISHED], take: $take) {\n      id\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n  }\n": typeof types.RecentGamesDocument,
    "\n  query PublicGame($id: Float!) {\n    game(id: $id) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      finishedAt\n      winnerTeam\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n        userId\n        seatNumber\n        username\n        status\n        fouls\n        points\n        eliminatedRound\n        role {\n          name\n          team\n        }\n      }\n    }\n  }\n": typeof types.PublicGameDocument,
    "\n  query Players($search: String, $skip: Int!, $take: Int!) {\n    users(search: $search, skip: $skip, take: $take) {\n      id\n      username\n      createdAt\n      club {\n        title\n      }\n    }\n  }\n": typeof types.PlayersDocument,
    "\n  query PlayerProfile($id: Int!) {\n    user(id: $id) {\n      id\n      username\n      createdAt\n      profile {\n        firstName\n        lastName\n      }\n      club {\n        title\n      }\n      socials {\n        type\n        link\n      }\n    }\n    players(userId: $id, take: 50) {\n      id\n      status\n      points\n      role {\n        name\n        team\n      }\n      game {\n        id\n        status\n        startDate\n        winnerTeam\n        gameType {\n          name\n        }\n      }\n    }\n  }\n": typeof types.PlayerProfileDocument,
    "\n  query Rating($from: DateTime, $take: Int!, $clubId: Int) {\n    rating(from: $from, take: $take, clubId: $clubId) {\n      place\n      points\n      games\n      wins\n      winRate\n      user {\n        id\n        username\n      }\n    }\n  }\n": typeof types.RatingDocument,
};
const documents: Documents = {
    "\n  query ClubRules($id: Int!) {\n    club(id: $id) {\n      title\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n  }\n": types.ClubRulesDocument,
    "\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      accessToken\n      role\n    }\n  }\n": types.SignInDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signup(input: $input) {\n      id\n    }\n  }\n": types.SignUpDocument,
    "\n  query Me {\n    me {\n      id\n      username\n      email\n      role\n    }\n    myClubs {\n      id\n      clubId\n      role\n      status\n      club {\n        title\n      }\n    }\n  }\n": types.MeDocument,
    "\n  mutation CreateClub($input: CreateClubInput!) {\n    createClub(input: $input) {\n      id\n    }\n  }\n": types.CreateClubDocument,
    "\n  mutation UpdateClub($id: Int!, $input: UpdateClubInput!) {\n    updateClub(id: $id, input: $input) {\n      id\n    }\n  }\n": types.UpdateClubDocument,
    "\n  mutation UpdateRatingRules($clubId: Int!, $rules: RatingRulesInput!) {\n    updateRatingRules(clubId: $clubId, rules: $rules) {\n      id\n    }\n  }\n": types.UpdateRatingRulesDocument,
    "\n  mutation JoinClub($clubId: Int!) {\n    joinClub(clubId: $clubId) {\n      id\n    }\n  }\n": types.JoinClubDocument,
    "\n  mutation LeaveClub($clubId: Int!) {\n    leaveClub(clubId: $clubId)\n  }\n": types.LeaveClubDocument,
    "\n  mutation ApproveClubMember($memberId: Int!) {\n    approveClubMember(memberId: $memberId) {\n      id\n    }\n  }\n": types.ApproveClubMemberDocument,
    "\n  mutation SetClubMemberRole($memberId: Int!, $role: ClubRole!) {\n    setClubMemberRole(memberId: $memberId, role: $role) {\n      id\n    }\n  }\n": types.SetClubMemberRoleDocument,
    "\n  mutation RemoveClubMember($memberId: Int!) {\n    removeClubMember(memberId: $memberId)\n  }\n": types.RemoveClubMemberDocument,
    "\n  mutation CreateTournament($input: CreateTournamentInput!) {\n    createTournament(input: $input) {\n      id\n    }\n  }\n": types.CreateTournamentDocument,
    "\n  mutation UpdateTournament($id: Int!, $input: UpdateTournamentInput!) {\n    updateTournament(id: $id, input: $input) {\n      id\n    }\n  }\n": types.UpdateTournamentDocument,
    "\n  mutation DeleteTournament($id: Int!) {\n    deleteTournament(id: $id)\n  }\n": types.DeleteTournamentDocument,
    "\n  mutation AddTournamentParticipant($tournamentId: Int!, $userId: Int!) {\n    addTournamentParticipant(tournamentId: $tournamentId, userId: $userId) {\n      id\n    }\n  }\n": types.AddTournamentParticipantDocument,
    "\n  mutation RemoveTournamentParticipant($tournamentId: Int!, $userId: Int!) {\n    removeTournamentParticipant(tournamentId: $tournamentId, userId: $userId) {\n      id\n    }\n  }\n": types.RemoveTournamentParticipantDocument,
    "\n  query Clubs($search: String) {\n    clubs(search: $search, take: 100) {\n      id\n      title\n      region\n      description\n    }\n  }\n": types.ClubsDocument,
    "\n  query Club($id: Int!, $clubId: Int!, $from: DateTime!) {\n    club(id: $id) {\n      id\n      title\n      region\n      description\n      createdAt\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n    clubMembers(clubId: $clubId) {\n      id\n      role\n      user {\n        id\n        username\n      }\n    }\n    games(clubId: $clubId, statuses: [WAITING, IN_PROGRESS], from: $from, take: 10) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n    }\n    rating(clubId: $clubId, take: 10) {\n      place\n      points\n      games\n      wins\n      winRate\n      user {\n        id\n        username\n      }\n    }\n    tournaments(clubId: $clubId, take: 20) {\n      id\n      name\n      status\n      startDate\n      endDate\n    }\n  }\n": types.ClubDocument,
    "\n  query ClubManage($id: Int!, $clubId: Int!) {\n    club(id: $id) {\n      id\n      title\n      region\n      description\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n    members: clubMembers(clubId: $clubId) {\n      id\n      role\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n    pending: clubMembers(clubId: $clubId, status: PENDING) {\n      id\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n": types.ClubManageDocument,
    "\n  query Tournaments($clubId: Int, $statuses: [TournamentStatus!]) {\n    tournaments(clubId: $clubId, statuses: $statuses, take: 100) {\n      id\n      name\n      status\n      startDate\n      endDate\n      club {\n        id\n        title\n      }\n    }\n  }\n": types.TournamentsDocument,
    "\n  query Tournament($id: Int!) {\n    tournament(id: $id) {\n      id\n      clubId\n      name\n      description\n      status\n      startDate\n      endDate\n      club {\n        id\n        title\n      }\n      standings {\n        place\n        points\n        games\n        wins\n        user {\n          id\n          username\n        }\n      }\n      participants {\n        id\n        user {\n          id\n          username\n        }\n      }\n      games {\n        id\n        status\n        phase\n        currentRound\n        startDate\n        winnerTeam\n        gameType {\n          name\n          playersCount\n        }\n        players {\n          id\n        }\n      }\n    }\n  }\n": types.TournamentDocument,
    "\n  query OpenTournaments {\n    tournaments(statuses: [PLANNED, ACTIVE], take: 100) {\n      id\n      clubId\n      name\n    }\n  }\n": types.OpenTournamentsDocument,
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
    "\n  query HostGames {\n    active: games(statuses: [WAITING, IN_PROGRESS], take: 100) {\n      id\n      clubId\n      club {\n        title\n      }\n      tournament {\n        name\n      }\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n    }\n    finished: games(statuses: [FINISHED], take: 30) {\n      id\n      clubId\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n    gameTypes {\n      id\n      name\n      playersCount\n    }\n    tournaments(statuses: [PLANNED, ACTIVE], take: 100) {\n      id\n      clubId\n      name\n    }\n  }\n": types.HostGamesDocument,
    "\n  query HostGame($id: Float!) {\n    game(id: $id) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      winnerTeam\n      gameType {\n        id\n        name\n        playersCount\n        maxFouls\n        gameTypeRoles {\n          count\n          role {\n            id\n            name\n            team\n          }\n        }\n      }\n      players {\n        id\n        userId\n        seatNumber\n        username\n        status\n        fouls\n        points\n        eliminatedRound\n        role {\n          id\n          name\n          team\n        }\n      }\n    }\n    roles {\n      id\n      actions {\n        actionType {\n          id\n          name\n          effect\n          phase\n        }\n      }\n    }\n  }\n": types.HostGameDocument,
    "\n  query NightActions($gameId: Int!) {\n    actions(gameId: $gameId, take: 100) {\n      id\n      round\n      phase\n      actorId\n      actionType {\n        name\n        effect\n      }\n      targets {\n        targetId\n      }\n    }\n  }\n": types.NightActionsDocument,
    "\n  query SearchUsers($search: String!) {\n    users(search: $search, take: 10) {\n      id\n      username\n    }\n  }\n": types.SearchUsersDocument,
    "\n  query UpcomingGames($from: DateTime!, $take: Int!) {\n    games(statuses: [WAITING, IN_PROGRESS], from: $from, take: $take) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n    }\n  }\n": types.UpcomingGamesDocument,
    "\n  query RecentGames($take: Int!) {\n    games(statuses: [FINISHED], take: $take) {\n      id\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n  }\n": types.RecentGamesDocument,
    "\n  query PublicGame($id: Float!) {\n    game(id: $id) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      finishedAt\n      winnerTeam\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n        userId\n        seatNumber\n        username\n        status\n        fouls\n        points\n        eliminatedRound\n        role {\n          name\n          team\n        }\n      }\n    }\n  }\n": types.PublicGameDocument,
    "\n  query Players($search: String, $skip: Int!, $take: Int!) {\n    users(search: $search, skip: $skip, take: $take) {\n      id\n      username\n      createdAt\n      club {\n        title\n      }\n    }\n  }\n": types.PlayersDocument,
    "\n  query PlayerProfile($id: Int!) {\n    user(id: $id) {\n      id\n      username\n      createdAt\n      profile {\n        firstName\n        lastName\n      }\n      club {\n        title\n      }\n      socials {\n        type\n        link\n      }\n    }\n    players(userId: $id, take: 50) {\n      id\n      status\n      points\n      role {\n        name\n        team\n      }\n      game {\n        id\n        status\n        startDate\n        winnerTeam\n        gameType {\n          name\n        }\n      }\n    }\n  }\n": types.PlayerProfileDocument,
    "\n  query Rating($from: DateTime, $take: Int!, $clubId: Int) {\n    rating(from: $from, take: $take, clubId: $clubId) {\n      place\n      points\n      games\n      wins\n      winRate\n      user {\n        id\n        username\n      }\n    }\n  }\n": types.RatingDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ClubRules($id: Int!) {\n    club(id: $id) {\n      title\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n  }\n"): typeof import('./graphql').ClubRulesDocument;
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
export function graphql(source: "\n  query Me {\n    me {\n      id\n      username\n      email\n      role\n    }\n    myClubs {\n      id\n      clubId\n      role\n      status\n      club {\n        title\n      }\n    }\n  }\n"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateClub($input: CreateClubInput!) {\n    createClub(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateClubDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateClub($id: Int!, $input: UpdateClubInput!) {\n    updateClub(id: $id, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateClubDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateRatingRules($clubId: Int!, $rules: RatingRulesInput!) {\n    updateRatingRules(clubId: $clubId, rules: $rules) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateRatingRulesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation JoinClub($clubId: Int!) {\n    joinClub(clubId: $clubId) {\n      id\n    }\n  }\n"): typeof import('./graphql').JoinClubDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LeaveClub($clubId: Int!) {\n    leaveClub(clubId: $clubId)\n  }\n"): typeof import('./graphql').LeaveClubDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ApproveClubMember($memberId: Int!) {\n    approveClubMember(memberId: $memberId) {\n      id\n    }\n  }\n"): typeof import('./graphql').ApproveClubMemberDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetClubMemberRole($memberId: Int!, $role: ClubRole!) {\n    setClubMemberRole(memberId: $memberId, role: $role) {\n      id\n    }\n  }\n"): typeof import('./graphql').SetClubMemberRoleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveClubMember($memberId: Int!) {\n    removeClubMember(memberId: $memberId)\n  }\n"): typeof import('./graphql').RemoveClubMemberDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTournament($input: CreateTournamentInput!) {\n    createTournament(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateTournamentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTournament($id: Int!, $input: UpdateTournamentInput!) {\n    updateTournament(id: $id, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateTournamentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTournament($id: Int!) {\n    deleteTournament(id: $id)\n  }\n"): typeof import('./graphql').DeleteTournamentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddTournamentParticipant($tournamentId: Int!, $userId: Int!) {\n    addTournamentParticipant(tournamentId: $tournamentId, userId: $userId) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddTournamentParticipantDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveTournamentParticipant($tournamentId: Int!, $userId: Int!) {\n    removeTournamentParticipant(tournamentId: $tournamentId, userId: $userId) {\n      id\n    }\n  }\n"): typeof import('./graphql').RemoveTournamentParticipantDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Clubs($search: String) {\n    clubs(search: $search, take: 100) {\n      id\n      title\n      region\n      description\n    }\n  }\n"): typeof import('./graphql').ClubsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Club($id: Int!, $clubId: Int!, $from: DateTime!) {\n    club(id: $id) {\n      id\n      title\n      region\n      description\n      createdAt\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n    clubMembers(clubId: $clubId) {\n      id\n      role\n      user {\n        id\n        username\n      }\n    }\n    games(clubId: $clubId, statuses: [WAITING, IN_PROGRESS], from: $from, take: 10) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n    }\n    rating(clubId: $clubId, take: 10) {\n      place\n      points\n      games\n      wins\n      winRate\n      user {\n        id\n        username\n      }\n    }\n    tournaments(clubId: $clubId, take: 20) {\n      id\n      name\n      status\n      startDate\n      endDate\n    }\n  }\n"): typeof import('./graphql').ClubDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ClubManage($id: Int!, $clubId: Int!) {\n    club(id: $id) {\n      id\n      title\n      region\n      description\n      ratingRules {\n        townWinPoints\n        mafiaWinPoints\n        neutralWinPoints\n        lossPoints\n        bonusEnabled\n        minGames\n      }\n    }\n    members: clubMembers(clubId: $clubId) {\n      id\n      role\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n    pending: clubMembers(clubId: $clubId, status: PENDING) {\n      id\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n"): typeof import('./graphql').ClubManageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Tournaments($clubId: Int, $statuses: [TournamentStatus!]) {\n    tournaments(clubId: $clubId, statuses: $statuses, take: 100) {\n      id\n      name\n      status\n      startDate\n      endDate\n      club {\n        id\n        title\n      }\n    }\n  }\n"): typeof import('./graphql').TournamentsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Tournament($id: Int!) {\n    tournament(id: $id) {\n      id\n      clubId\n      name\n      description\n      status\n      startDate\n      endDate\n      club {\n        id\n        title\n      }\n      standings {\n        place\n        points\n        games\n        wins\n        user {\n          id\n          username\n        }\n      }\n      participants {\n        id\n        user {\n          id\n          username\n        }\n      }\n      games {\n        id\n        status\n        phase\n        currentRound\n        startDate\n        winnerTeam\n        gameType {\n          name\n          playersCount\n        }\n        players {\n          id\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').TournamentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OpenTournaments {\n    tournaments(statuses: [PLANNED, ACTIVE], take: 100) {\n      id\n      clubId\n      name\n    }\n  }\n"): typeof import('./graphql').OpenTournamentsDocument;
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
export function graphql(source: "\n  query HostGames {\n    active: games(statuses: [WAITING, IN_PROGRESS], take: 100) {\n      id\n      clubId\n      club {\n        title\n      }\n      tournament {\n        name\n      }\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n    }\n    finished: games(statuses: [FINISHED], take: 30) {\n      id\n      clubId\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n    gameTypes {\n      id\n      name\n      playersCount\n    }\n    tournaments(statuses: [PLANNED, ACTIVE], take: 100) {\n      id\n      clubId\n      name\n    }\n  }\n"): typeof import('./graphql').HostGamesDocument;
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UpcomingGames($from: DateTime!, $take: Int!) {\n    games(statuses: [WAITING, IN_PROGRESS], from: $from, take: $take) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n      }\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').UpcomingGamesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RecentGames($take: Int!) {\n    games(statuses: [FINISHED], take: $take) {\n      id\n      startDate\n      winnerTeam\n      gameType {\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').RecentGamesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PublicGame($id: Float!) {\n    game(id: $id) {\n      id\n      status\n      phase\n      currentRound\n      startDate\n      finishedAt\n      winnerTeam\n      club {\n        id\n        title\n      }\n      tournament {\n        id\n        name\n      }\n      gameType {\n        name\n        playersCount\n      }\n      players {\n        id\n        userId\n        seatNumber\n        username\n        status\n        fouls\n        points\n        eliminatedRound\n        role {\n          name\n          team\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').PublicGameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Players($search: String, $skip: Int!, $take: Int!) {\n    users(search: $search, skip: $skip, take: $take) {\n      id\n      username\n      createdAt\n      club {\n        title\n      }\n    }\n  }\n"): typeof import('./graphql').PlayersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PlayerProfile($id: Int!) {\n    user(id: $id) {\n      id\n      username\n      createdAt\n      profile {\n        firstName\n        lastName\n      }\n      club {\n        title\n      }\n      socials {\n        type\n        link\n      }\n    }\n    players(userId: $id, take: 50) {\n      id\n      status\n      points\n      role {\n        name\n        team\n      }\n      game {\n        id\n        status\n        startDate\n        winnerTeam\n        gameType {\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').PlayerProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Rating($from: DateTime, $take: Int!, $clubId: Int) {\n    rating(from: $from, take: $take, clubId: $clubId) {\n      place\n      points\n      games\n      wins\n      winRate\n      user {\n        id\n        username\n      }\n    }\n  }\n"): typeof import('./graphql').RatingDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
