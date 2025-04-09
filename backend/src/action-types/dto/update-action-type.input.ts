import { CreateActionTypeInput } from './create-action-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateActionTypeInput extends PartialType(CreateActionTypeInput) {
  @Field(() => Int)
  id: number;
}
