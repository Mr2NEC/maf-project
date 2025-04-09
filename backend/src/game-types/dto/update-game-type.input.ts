import { CreateGameTypeInput } from './create-game-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGameTypeInput extends PartialType(CreateGameTypeInput) {
  @Field(() => Int)
  id: number;
}
