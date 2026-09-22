import { graphql } from "@/gql";

export const ClubsQuery = graphql(`
  query Clubs($search: String) {
    clubs(search: $search, take: 100) {
      id
      title
      region
      description
    }
  }
`);

export const ClubQuery = graphql(`
  query Club($id: Int!, $clubId: Int!, $from: DateTime!) {
    club(id: $id) {
      id
      title
      region
      description
      createdAt
      ratingRules {
        townWinPoints
        mafiaWinPoints
        neutralWinPoints
        lossPoints
        bonusEnabled
        minGames
      }
    }
    clubMembers(clubId: $clubId) {
      id
      role
      user {
        id
        username
      }
    }
    games(clubId: $clubId, statuses: [WAITING, IN_PROGRESS], from: $from, take: 10) {
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
      club {
        id
        title
      }
      tournament {
        id
        name
      }
    }
    rating(clubId: $clubId, take: 10) {
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
    tournaments(clubId: $clubId, take: 20) {
      id
      name
      status
      startDate
      endDate
    }
  }
`);

export const ClubManageQuery = graphql(`
  query ClubManage($id: Int!, $clubId: Int!) {
    club(id: $id) {
      id
      title
      region
      description
      ratingRules {
        townWinPoints
        mafiaWinPoints
        neutralWinPoints
        lossPoints
        bonusEnabled
        minGames
      }
    }
    members: clubMembers(clubId: $clubId) {
      id
      role
      createdAt
      user {
        id
        username
      }
    }
    pending: clubMembers(clubId: $clubId, status: PENDING) {
      id
      createdAt
      user {
        id
        username
      }
    }
  }
`);

export const TournamentsQuery = graphql(`
  query Tournaments($clubId: Int, $statuses: [TournamentStatus!]) {
    tournaments(clubId: $clubId, statuses: $statuses, take: 100) {
      id
      name
      status
      startDate
      endDate
      club {
        id
        title
      }
    }
  }
`);

export const TournamentQuery = graphql(`
  query Tournament($id: Int!) {
    tournament(id: $id) {
      id
      clubId
      name
      description
      status
      startDate
      endDate
      club {
        id
        title
      }
      standings {
        place
        points
        games
        wins
        user {
          id
          username
        }
      }
      participants {
        id
        user {
          id
          username
        }
      }
      games {
        id
        status
        phase
        currentRound
        startDate
        winnerTeam
        gameType {
          name
          playersCount
        }
        players {
          id
        }
      }
    }
  }
`);

/** Tournaments a host can add games to, for the new game form. */
export const OpenTournamentsQuery = graphql(`
  query OpenTournaments {
    tournaments(statuses: [PLANNED, ACTIVE], take: 100) {
      id
      clubId
      name
    }
  }
`);
