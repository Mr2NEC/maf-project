import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Team } from 'src/enums/team.enum';

@InputType()
export class CreateRoleInput {
  @Field(() => String)
  @IsString()
  @MaxLength(50)
  name: string;

  @Field(() => Team, { defaultValue: Team.TOWN })
  @IsOptional()
  @IsEnum(Team)
  team?: Team;

  /** Action types this role may use */
  @Field(() => [Int])
  @IsInt({ each: true })
  actionIds: number[];
}
