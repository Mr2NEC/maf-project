import { GamePhase } from 'src/enums/game-phase.enum';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ActionType } from 'src/action-types/entities/action-type.entity';
import { Game } from 'src/games/entities/game.entity';
import { Player } from 'src/players/entities/player.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ActionTarget } from 'src/action-targets/entities/action-target.entity';

@ObjectType()
@Entity({ name: 'actions' })
export class Action {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(() => Int)
  @Column({ name: 'game_id' })
  gameId: number;

  @Field(() => Game)
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Field(() => Int)
  @Column({ name: 'actor_id' })
  actorId: number;

  @Field(() => Player)
  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actor_id' })
  actor: Player;

  @Field(() => [ActionTarget], { nullable: true })
  @OneToMany(() => ActionTarget, actionTarget => actionTarget.action, {
    nullable: true,
  })
  targets: ActionTarget[];

  @Field(() => Int)
  @Column({ name: 'action_type_id' })
  actionTypeId: number;

  @Field(() => ActionType)
  @ManyToOne(() => ActionType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'action_type_id' })
  actionType: ActionType;

  @Field(() => Int)
  @Column()
  round: number;

  @Field(() => GamePhase)
  @Column({ type: 'enum', enum: GamePhase, default: GamePhase.NIGHT })
  phase: GamePhase;

  @Field(() => Int)
  @Column()
  order: number;
}
