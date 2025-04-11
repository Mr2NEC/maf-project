import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { GameType } from 'src/game-types/entities/game-type.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class GameTypeRole {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ name: 'game_type_id' })
  gameTypeId: number;

  @Field(() => GameType)
  @ManyToOne(() => GameType, gameType => gameType.gameTypeRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game_type_id' })
  gameType: GameType;

  @Field(() => Int)
  @Column({ name: 'role_id' })
  roleId: number;

  @Field(() => Role)
  @ManyToOne(() => Role, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field(() => Int)
  @Column()
  count: number;
}
