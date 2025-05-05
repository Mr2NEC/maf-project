import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ActionType } from 'src/action-types/entities/action-type.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'role_actions' })
export class RoleAction {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ name: 'role_id' })
  roleId: number;

  @Field(() => Role)
  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field(() => Int)
  @Column({ name: 'action_type_id' })
  actionTypeId: number;

  @Field(() => ActionType)
  @ManyToOne(() => ActionType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'action_type_id' })
  actionType: ActionType;
}
