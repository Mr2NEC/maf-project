import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateGameInput {
  @Field(() => Date)
  startDate: Date;

  @Field(() => Int)
  gameTypeId: number;
}
