import { ArgsType, Field } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';
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
}
