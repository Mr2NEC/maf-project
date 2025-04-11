import { InputType, Int, Field } from '@nestjs/graphql';
import { Role } from 'src/roles/entities/role.entity';

@InputType()
export class CreateRoleActionInput {
  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => Int)
  actionTypeId: number;
}
