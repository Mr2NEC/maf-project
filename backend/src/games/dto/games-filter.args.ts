import { ArgsType, Field } from '@nestjs/graphql';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { GameStatus } from 'src/enums/game-status.enum';

@ArgsType()
export class GamesFilterArgs extends PaginationArgs {
  @Field(() => [GameStatus], { nullable: true })
  @IsOptional()
  @IsEnum(GameStatus, { each: true })
  statuses?: GameStatus[];

  /** Only games starting at or after this moment, soonest first (calendar) */
  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  from?: Date;
}
