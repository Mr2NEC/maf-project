import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateGameInput } from './create-game.input';
import { GameStatus } from 'src/enums/game-status.enum';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field(() => Int)
  id: number;

  @Field(() => GameStatus, { nullable: true })
  status?: GameStatus;

  @Field(() => Int, { nullable: true })
  currentRound?: number;
}
