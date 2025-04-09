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
} from 'typeorm';
import { ActionTarget } from 'src/action-targets/entities/action-target.entity';

@ObjectType()
@Entity({ name: 'actions' })
export class Action {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(() => Game)
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  game: Game;

  @Field(() => Player)
  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  actor: Player;

  @Field(() => [ActionTarget], { nullable: true })
  @OneToMany(() => ActionTarget, actionTarget => actionTarget.action)
  targets: ActionTarget[];

  @Field(() => ActionType)
  @ManyToOne(() => ActionType, { onDelete: 'CASCADE' })
  actionType: ActionType;

  @Field(() => Int)
  @Column()
  round: number;

  @Field(() => Int)
  @Column()
  order: number;
}
