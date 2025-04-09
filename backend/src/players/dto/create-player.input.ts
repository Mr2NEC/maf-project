import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePlayerInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  gameId: number;

  @Field(() => Int, { nullable: true })
  roleId?: number;

  @Field(() => Int, { nullable: true })
  seatNumber?: number;

  @Field(() => String, { nullable: true })
  username?: string;
}
