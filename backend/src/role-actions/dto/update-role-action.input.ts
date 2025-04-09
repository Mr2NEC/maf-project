import { CreateRoleActionInput } from './create-role-action.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleActionInput extends PartialType(CreateRoleActionInput) {
  @Field(() => Int)
  id: number;
}
