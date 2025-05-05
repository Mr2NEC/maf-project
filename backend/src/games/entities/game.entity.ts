import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Action } from 'src/actions/entities/action.entity';
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

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

registerEnumType(GameStatus, {
  name: 'GameStatus',
  description: 'The status of a game',
});

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
