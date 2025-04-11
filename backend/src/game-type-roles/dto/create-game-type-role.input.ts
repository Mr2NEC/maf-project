import { InputType, Int, Field } from '@nestjs/graphql';
import { GameType } from 'src/game-types/entities/game-type.entity';
import { Role } from 'src/roles/entities/role.entity';

@InputType()
export class CreateGameTypeRoleInput {
  @Field(() => Int)
  count: number;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => GameType, { nullable: true })
  gameType?: GameType;

  @Field(() => Int, { nullable: true })
  roleId?: number;

  @Field(() => Int, { nullable: true })
  gameTypeId?: number;
}
