import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ActionType } from 'src/action-types/entities/action-type.entity';
import { Role } from 'src/roles/entities/role.entity';
import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class RoleAction {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Role)
  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  role: Role;

  @Field(() => ActionType)
  @ManyToOne(() => ActionType, { onDelete: 'CASCADE' })
  actionType: ActionType;
}
