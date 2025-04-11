import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateActionInput {
  @Field(() => Int)
  gameId: number;

  @Field(() => Int)
  actorId: number;

  @Field(() => [Int])
  targets: number[];

  @Field(() => Int)
  actionTypeId: number;

  @Field(() => Int)
  round: number;

  @Field(() => Int)
  order: number;
}
