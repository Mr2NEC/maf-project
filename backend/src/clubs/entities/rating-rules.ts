import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNumber, Max, Min } from 'class-validator';
import { Column } from 'typeorm';

/**
 * How a club turns game results into rating points. Stored as columns of the
 * club (embedded), editable by club admins.
 */
@ObjectType()
@InputType('RatingRulesInput')
export class RatingRules {
  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-10)
  @Max(10)
  @Column({ name: 'rating_town_win_points', type: 'float', default: 1 })
  townWinPoints: number;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-10)
  @Max(10)
  @Column({ name: 'rating_mafia_win_points', type: 'float', default: 1 })
  mafiaWinPoints: number;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-10)
  @Max(10)
  @Column({ name: 'rating_neutral_win_points', type: 'float', default: 1 })
  neutralWinPoints: number;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-10)
  @Max(10)
  @Column({ name: 'rating_loss_points', type: 'float', default: 0 })
  lossPoints: number;

  /** Whether the host's bonus points count towards the rating */
  @Field()
  @IsBoolean()
  @Column({ name: 'rating_bonus_enabled', default: true })
  bonusEnabled: boolean;

  /** Players with fewer finished games are left out of the rating table */
  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(1000)
  @Column({ name: 'rating_min_games', default: 0 })
  minGames: number;
}

export const DEFAULT_RATING_RULES: RatingRules = {
  townWinPoints: 1,
  mafiaWinPoints: 1,
  neutralWinPoints: 1,
  lossPoints: 0,
  bonusEnabled: true,
  minGames: 0,
};
