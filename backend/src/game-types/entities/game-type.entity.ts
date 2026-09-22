import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameTypeRole } from 'src/game-type-roles/entities/game-type-role.entity';
import { Game } from 'src/games/entities/game.entity';

@ObjectType()
@Entity({ name: 'game_types' })
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

  /** A player with this many fouls is disqualified */
  @Field(() => Int)
  @Column({ default: 4 })
  maxFouls: number;

  @Field(() => [Game])
  @OneToMany(() => Game, game => game.gameType)
  games: Game[];

  @Field(() => [GameTypeRole])
  @OneToMany(() => GameTypeRole, role => role.gameType)
  gameTypeRoles: GameTypeRole[];
}
