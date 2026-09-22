import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { GameStatus } from 'src/enums/game-status.enum';
import { CreateGameInput } from './create-game.input';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field(() => GameStatus, { nullable: true })
  @IsOptional()
  @IsEnum(GameStatus)
  status?: GameStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentRound?: number;
}
