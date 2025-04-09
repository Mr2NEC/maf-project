import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
@Entity({ name: 'games' })
export class Game {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: ['waiting', 'in_progress', 'finished'],
    default: 'waiting',
  })
  status: string;

  @Field(() => [Player], { nullable: true })
  @OneToMany(() => Player, player => player.game, { nullable: true })
  players: Player[];

  @Field(() => Int)
  @Column({ default: 0 })
  currentRound: number;

  @Field(() => Int)
  @Column({ name: 'game_type_id' })
  gameTypeId: number;

  @ManyToOne(() => GameType, gameType => gameType.games)
  @JoinColumn({ name: 'game_type_id' })
  gameType: GameType;

  @Field(() => Date)
  @Column()
  startDate: Date;

  @Field(() => [Action])
  @OneToMany(() => Action, action => action.game)
  actions: Action[];

  @CreateDateColumn()
  @Field()
  readonly createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
