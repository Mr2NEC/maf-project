import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateGameInput } from './create-game.input';
import { Action } from 'src/actions/entities/action.entity';
import { Player } from 'src/players/entities/player.entity';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  status: string;

  @Field(() => [Action])
  actions: Action[];

  @Field(() => Int)
  currentRound: number;

  @Field(() => [Player])
  players: Player[];
}
