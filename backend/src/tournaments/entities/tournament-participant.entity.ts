import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tournament } from './tournament.entity';

@ObjectType()
@Entity({ name: 'tournament_participants' })
@Unique('UQ_tournament_participants', ['tournamentId', 'userId'])
export class TournamentParticipant {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ name: 'tournament_id' })
  tournamentId: number;

  @ManyToOne(() => Tournament, t => t.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Field(() => Int)
  @Column({ name: 'user_id' })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
