import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateActionTargetInput {
  @Field(() => Int)
  actionId: number;

  @Field(() => Int)
  targetId: number;
}
