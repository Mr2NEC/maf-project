import { graphql } from "@/gql";

export const HostGamesQuery = graphql(`
  query HostGames {
    active: games(statuses: [WAITING, IN_PROGRESS], take: 100) {
      id
      clubId
      club {
        title
      }
      tournament {
        name
      }
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
    finished: games(statuses: [FINISHED], take: 30) {
      id
      clubId
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
    tournaments(statuses: [PLANNED, ACTIVE], take: 100) {
      id
      clubId
      name
    }
  }
`);

export const HostGameQuery = graphql(`
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
`);

export const NightActionsQuery = graphql(`
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
`);

export const SearchUsersQuery = graphql(`
  query SearchUsers($search: String!) {
    users(search: $search, take: 10) {
      id
      username
    }
  }
`);
