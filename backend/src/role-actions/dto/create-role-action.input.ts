import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoleActionInput {
  @Field(() => Int)
  roleId: number;

  @Field(() => Int)
  actionTypeId: number;
}
