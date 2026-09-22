import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

export const MAX_PAGE_SIZE = 100;

/** Offset pagination for list queries: `users(skip: 0, take: 20)`. */
@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  skip = 0;

  @Field(() => Int, { defaultValue: 50 })
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  take = 50;
}
