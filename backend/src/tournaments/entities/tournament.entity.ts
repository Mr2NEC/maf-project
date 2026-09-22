import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Club } from 'src/clubs/entities/club.entity';
import { TournamentStatus } from 'src/enums/tournament-status.enum';
import { Game } from 'src/games/entities/game.entity';
import { TournamentParticipant } from './tournament-participant.entity';

/** A series of club games; the table is the sum of points in its games. */
@ObjectType()
@Entity({ name: 'tournaments' })
export class Tournament {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ name: 'club_id' })
  clubId: number;

  @Field(() => Club)
  @ManyToOne(() => Club, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Field()
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Field()
  @Column()
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true })
  endDate: Date | null;

  @Field(() => TournamentStatus)
  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.PLANNED,
  })
  status: TournamentStatus;

  @OneToMany(() => TournamentParticipant, p => p.tournament)
  participants: TournamentParticipant[];

  @OneToMany(() => Game, game => game.tournament)
  games: Game[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
