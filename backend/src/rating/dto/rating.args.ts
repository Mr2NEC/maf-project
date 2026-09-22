import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common/dto/pagination.args';

@ArgsType()
export class RatingArgs extends PaginationArgs {
  /** Count games finished at or after this moment */
  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  from?: Date;

  /** Count games finished before this moment */
  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  to?: Date;

  /** A club's rating: its games only, with the club's minimum number of games */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  clubId?: number;
}
