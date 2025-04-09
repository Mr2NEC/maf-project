import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGameTypeRoleInput {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  roleId: number;

  @Field(() => Int)
  gameTypeId: number;
}
