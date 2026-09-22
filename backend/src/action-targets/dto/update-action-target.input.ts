import { CreateActionTargetInput } from './create-action-target.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateActionTargetInput extends PartialType(
  CreateActionTargetInput,
) {
  @Field(() => Int)
  id: number;
}
