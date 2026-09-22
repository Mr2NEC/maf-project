import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class RatingEntry {
  /** 1-based position, ties share the order of the query */
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

  /** wins / games, 0..1 */
  @Field(() => Float)
  winRate: number;
}
