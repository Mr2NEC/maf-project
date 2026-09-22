import { PlayerStatus } from 'src/enums/player-status.enum';
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Float, ID, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Game } from 'src/games/entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@ObjectType()
@Entity({ name: 'players' })
@Unique('UQ_players_game_seat', ['gameId', 'seatNumber'])
@Unique('UQ_players_game_user', ['gameId', 'userId'])
export class Player {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  @IsString()
  username: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  seatNumber: number;

  @Field(() => PlayerStatus)
  @Column({ type: 'enum', enum: PlayerStatus, default: PlayerStatus.ALIVE })
  status: PlayerStatus;

  /** Round in which the player left the game */
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  eliminatedRound: number | null;

  @Field(() => Int)
  @Column({ default: 0 })
  fouls: number;

  /** Points for this game: 1 for a win plus bonus points from the host */
  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  points: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @Field(() => Role, { nullable: true })
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field(() => Int)
  @Column({ name: 'user_id' })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Int)
  @Column({ name: 'game_id' })
  gameId: number;

  @Field(() => Game)
  @ManyToOne(() => Game, game => game.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
