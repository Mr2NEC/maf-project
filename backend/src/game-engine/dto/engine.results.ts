import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from 'src/enums/team.enum';
import { Game } from 'src/games/entities/game.entity';
import { Player } from 'src/players/entities/player.entity';

@ObjectType()
export class CheckOutcome {
  @Field(() => Player)
  actor: Player;

  @Field(() => Player)
  target: Player;

  /** null when the checker was blocked */
  @Field(() => Team, { nullable: true })
  team: Team | null;
}

@ObjectType()
export class NightResult {
  @Field(() => Game)
  game: Game;

  @Field(() => [Player])
  killed: Player[];

  /** Targeted by a kill but healed */
  @Field(() => [Player])
  saved: Player[];

  /** Their own action was cancelled */
  @Field(() => [Player])
  blocked: Player[];

  @Field(() => [CheckOutcome])
  checks: CheckOutcome[];
}

@ObjectType()
export class DayResult {
  @Field(() => Game)
  game: Game;

  @Field(() => [Player])
  eliminated: Player[];

  /**
   * The vote ended in a tie and no tie break was given: nothing changed,
   * revote or send the same votes again with a tieBreak.
   */
  @Field()
  tie: boolean;

  @Field(() => [Player])
  tiedPlayers: Player[];
}
