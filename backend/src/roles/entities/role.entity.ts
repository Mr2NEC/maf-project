import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleAction } from 'src/role-actions/entities/role-action.entity';
import { GameTypeRole } from 'src/game-type-roles/entities/game-type-role.entity';

@ObjectType()
@Entity({ name: 'roles' })
export class Role {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [RoleAction], { defaultValue: [] })
  @OneToMany(() => RoleAction, roleAction => roleAction.role)
  actions: RoleAction[];

  @Field(() => [GameTypeRole], { defaultValue: [] })
  @OneToMany(() => GameTypeRole, gameTypeRole => gameTypeRole.role)
  gameTypeRoles: GameTypeRole[];
}
