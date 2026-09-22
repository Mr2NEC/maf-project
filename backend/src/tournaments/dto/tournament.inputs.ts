import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TournamentStatus } from 'src/enums/tournament-status.enum';

@InputType()
export class CreateTournamentInput {
  @Field(() => Int)
  @IsInt()
  clubId: number;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @Field()
  @IsDate()
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;
}

@InputType()
export class UpdateTournamentInput extends PartialType(
  OmitType(CreateTournamentInput, ['clubId'] as const),
) {
  @Field(() => TournamentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus;
}
