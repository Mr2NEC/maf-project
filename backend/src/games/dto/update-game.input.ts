import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateGameInput } from './create-game.input';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Int, { nullable: true })
  currentRound?: number;
}
