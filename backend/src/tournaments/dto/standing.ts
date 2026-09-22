import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

/** One row of a tournament table. */
@ObjectType()
export class TournamentStanding {
  @Field(() => Int)
  place: number;

  @Field(() => User)
  user: User;

  @Field(() => Float)
  points: number;

  @Field(() => Int)
  games: number;

  @Field(() => Int)
  wins: number;
}
