import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, Min } from 'class-validator';

@InputType()
export class CreateGameInput {
  @Field(() => Date)
  @IsDate()
  startDate: Date;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  gameTypeId: number;
}
