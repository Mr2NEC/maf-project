import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateGameTypeRoleInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  count: number;

  @Field(() => Int)
  @IsInt()
  roleId: number;

  /** Set by the server when roles are created together with a game type. */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  gameTypeId?: number;
}
