import { GamePhase } from 'src/enums/game-phase.enum';
import { Team } from 'src/enums/team.enum';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Action } from 'src/actions/entities/action.entity';
import { GameStatus } from 'src/enums/game-status.enum';
import { GameType } from 'src/game-types/entities/game-type.entity';
import { Player } from 'src/players/entities/player.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'games' })
export class Game {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(() => GameStatus)
  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING,
  })
  status: GameStatus;

  @Field(() => [Player])
  @OneToMany(() => Player, player => player.game)
  players: Player[];

  @Field(() => Int)
  @Column({ default: 0 })
  currentRound: number;

  /** Current phase while the game is in progress */
  @Field(() => GamePhase, { nullable: true })
  @Column({ type: 'enum', enum: GamePhase, nullable: true })
  phase: GamePhase | null;

  @Field(() => Team, { nullable: true })
  @Column({ type: 'enum', enum: Team, nullable: true })
  winnerTeam: Team | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true })
  finishedAt: Date | null;

  @Field(() => Int)
  @Column({ name: 'game_type_id' })
  gameTypeId: number;

  @Field(() => GameType)
  @ManyToOne(() => GameType, gameType => gameType.games)
  @JoinColumn({ name: 'game_type_id' })
  gameType: GameType;

  @Field(() => Date)
  @Column()
  startDate: Date;

  @Field(() => [Action])
  @OneToMany(() => Action, action => action.game)
  actions: Action[];

  @Field(() => Date)
  @CreateDateColumn()
  readonly createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
