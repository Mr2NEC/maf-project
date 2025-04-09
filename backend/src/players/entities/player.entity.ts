import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Game } from 'src/games/entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@ObjectType()
@Entity({ name: 'players' })
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

  @Field(() => Int, { nullable: true })
  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field(() => Int)
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Int)
  @Column({ name: 'game_id' })
  gameId: number;

  @ManyToOne(() => Game, game => game.players)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
