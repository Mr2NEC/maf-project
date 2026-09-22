import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateGameInput {
  @Field(() => Date)
  @IsDate()
  startDate: Date;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  gameTypeId: number;

  /** Club running the game; taken from the tournament when omitted */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  clubId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  tournamentId?: number;
}
