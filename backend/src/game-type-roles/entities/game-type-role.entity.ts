import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { GameType } from 'src/game-types/entities/game-type.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class GameTypeRole {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => GameType)
  @ManyToOne(() => GameType, gameType => gameType.roles, {
    onDelete: 'CASCADE',
  })
  gameType: GameType;

  @Field(() => Role)
  @ManyToOne(() => Role, { nullable: false, onDelete: 'CASCADE' })
  role: Role;

  @Field(() => Int)
  @Column()
  count: number;
}
