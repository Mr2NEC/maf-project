import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoleAction } from 'src/role-actions/entities/role-action.entity';
import { GameTypeRole } from 'src/game-type-roles/entities/game-type-role.entity';

@ObjectType()
export class Role {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [RoleAction], { nullable: true })
  @OneToMany(() => RoleAction, roleAction => roleAction.role, {
    nullable: true,
  })
  actions: RoleAction[];

  @Field(() => [GameTypeRole], { nullable: true })
  @OneToMany(() => GameTypeRole, gameTypeRole => gameTypeRole.role, {
    nullable: true,
  })
  gameTypeRoles: GameTypeRole[];
}
