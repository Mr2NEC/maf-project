import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateGameTypeRoleInput } from 'src/game-type-roles/dto/create-game-type-role.input';

@InputType()
export class CreateGameTypeInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  playersCount: number;

  @Field(() => [CreateGameTypeRoleInput])
  roles: CreateGameTypeRoleInput[];
}
