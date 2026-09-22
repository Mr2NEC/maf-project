import { CreateGameTypeRoleInput } from './create-game-type-role.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGameTypeRoleInput extends PartialType(
  CreateGameTypeRoleInput,
) {
  @Field(() => Int)
  id: number;
}
