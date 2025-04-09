import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreatePlayerInput } from './create-player.input';

@InputType()
export class UpdatePlayerInput extends PartialType(CreatePlayerInput) {
  @Field(() => Int)
  id: number;
}
