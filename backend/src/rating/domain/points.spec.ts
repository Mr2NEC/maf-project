import {
  DEFAULT_RATING_RULES,
  RatingRules,
} from 'src/clubs/entities/rating-rules';
import { Team } from 'src/enums/team.enum';
import { gamePoints, hasWon } from './points';

describe('gamePoints', () => {
  const rules: RatingRules = {
    ...DEFAULT_RATING_RULES,
    townWinPoints: 1,
    mafiaWinPoints: 1.5,
    neutralWinPoints: 2,
    lossPoints: -0.5,
  };

  it("gives the win points of the player's team", () => {
    expect(
      gamePoints(rules, { team: Team.TOWN, winnerTeam: Team.TOWN, bonus: 0 }),
    ).toBe(1);
    expect(
      gamePoints(rules, { team: Team.MAFIA, winnerTeam: Team.MAFIA, bonus: 0 }),
    ).toBe(1.5);
    expect(
      gamePoints(rules, {
        team: Team.NEUTRAL,
        winnerTeam: Team.NEUTRAL,
        bonus: 0,
      }),
    ).toBe(2);
  });

  it('gives loss points to the losing side', () => {
    expect(
      gamePoints(rules, { team: Team.TOWN, winnerTeam: Team.MAFIA, bonus: 0 }),
    ).toBe(-0.5);
  });

  it('adds the bonus only when bonuses count', () => {
    const result = { team: Team.TOWN, winnerTeam: Team.TOWN, bonus: 0.3 };

    expect(gamePoints(rules, result)).toBe(1.3);
    expect(gamePoints({ ...rules, bonusEnabled: false }, result)).toBe(1);
  });

  it('treats a player without a role as not winning', () => {
    const result = { team: null, winnerTeam: Team.TOWN, bonus: 0 };

    expect(hasWon(result)).toBe(false);
    expect(gamePoints(rules, result)).toBe(-0.5);
  });

  it('keeps the classic default: 1 for a win, 0 for a loss, bonus included', () => {
    expect(
      gamePoints(DEFAULT_RATING_RULES, {
        team: Team.MAFIA,
        winnerTeam: Team.MAFIA,
        bonus: 0.5,
      }),
    ).toBe(1.5);
    expect(
      gamePoints(DEFAULT_RATING_RULES, {
        team: Team.TOWN,
        winnerTeam: Team.MAFIA,
        bonus: 0,
      }),
    ).toBe(0);
  });
});
