import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ActionEffect } from 'src/enums/action-effect.enum';
import { GamePhase } from 'src/enums/game-phase.enum';

@InputType()
export class CreateActionTypeInput {
  @Field()
  @IsString()
  @MaxLength(50)
  name: string;

  @Field(() => ActionEffect, { defaultValue: ActionEffect.NOTE })
  @IsOptional()
  @IsEnum(ActionEffect)
  effect?: ActionEffect;

  /** Leave empty to allow the action in any phase */
  @Field(() => GamePhase, { nullable: true })
  @IsOptional()
  @IsEnum(GamePhase)
  phase?: GamePhase | null;
}
