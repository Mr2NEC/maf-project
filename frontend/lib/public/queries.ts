import { graphql } from "@/gql";

export const UpcomingGamesQuery = graphql(`
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
`);

export const RecentGamesQuery = graphql(`
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
`);

export const PublicGameQuery = graphql(`
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
`);

export const PlayersQuery = graphql(`
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
`);

export const PlayerProfileQuery = graphql(`
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
`);

export const RatingQuery = graphql(`
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
`);
