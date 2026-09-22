import {
  Field,
  Float,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { TieBreak } from '../domain/types';

registerEnumType(TieBreak, {
  name: 'TieBreak',
  description: 'How to settle a tie in the day vote',
});

@InputType()
export class AddPlayerInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  /** Free seat is picked automatically when omitted */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  seatNumber?: number;
}

@InputType()
export class RoleAssignmentInput {
  @Field(() => Int)
  @IsInt()
  playerId: number;

  @Field(() => Int)
  @IsInt()
  roleId: number;
}

@InputType()
export class AssignRolesInput {
  /** Deal roles randomly by the game type composition */
  @Field({ defaultValue: false })
  @IsBoolean()
  random: boolean;

  /** Roles from cards dealt at the table; required when random is false */
  @Field(() => [RoleAssignmentInput], { nullable: true })
  @IsOptional()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => RoleAssignmentInput)
  assignments?: RoleAssignmentInput[];
}

@InputType()
export class NightActionInput {
  @Field(() => Int)
  @IsInt()
  actorId: number;

  @Field(() => Int)
  @IsInt()
  actionTypeId: number;

  @Field(() => Int)
  @IsInt()
  targetId: number;
}

@InputType()
export class VoteInput {
  /** The nominee */
  @Field(() => Int)
  @IsInt()
  targetId: number;

  @Field(() => [Int])
  @ArrayMaxSize(30)
  @IsInt({ each: true })
  voterIds: number[];
}

@InputType()
export class EndDayInput {
  /** Empty when nobody was nominated */
  @Field(() => [VoteInput])
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => VoteInput)
  votes: VoteInput[];

  /** Needed only when the vote ended in a tie */
  @Field(() => TieBreak, { nullable: true })
  @IsOptional()
  @IsEnum(TieBreak)
  tieBreak?: TieBreak;
}

@InputType()
export class AwardBonusInput {
  @Field(() => Int)
  @IsInt()
  playerId: number;

  /** Added to the player's points, e.g. 0.5 for the best move; may be negative */
  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-2)
  @Max(2)
  points: number;
}
