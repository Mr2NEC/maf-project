import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { GameTypeRole } from 'src/game-type-roles/entities/game-type-role.entity';
import { Game } from 'src/games/entities/game.entity';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class GameType {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field(() => Int)
  @Column()
  playersCount: number;

  @Field(() => [Game], { nullable: true })
  @OneToMany(() => Game, game => game.gameType, { nullable: true })
  games: Game[];

  @Field(() => [GameTypeRole])
  @OneToMany(() => GameTypeRole, gameTypeRole => gameTypeRole.gameType)
  gameTypeRoles: GameTypeRole[];
}
