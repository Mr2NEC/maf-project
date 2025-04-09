import { CreateActionInput } from './create-action.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateActionInput extends PartialType(CreateActionInput) {
  @Field(() => Int)
  id: number;
}
