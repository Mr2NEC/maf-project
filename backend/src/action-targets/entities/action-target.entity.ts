import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Action } from 'src/actions/entities/action.entity';
import { Player } from 'src/players/entities/player.entity';

@ObjectType()
@Entity({ name: 'action_targets' })
export class ActionTarget {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(() => Action)
  @ManyToOne(() => Action, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'action_id' })
  action: Action;

  @Field(() => Int)
  @Column({ name: 'action_id' })
  actionId: number;

  @Field(() => Player)
  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_id' })
  target: Player;

  @Field(() => Int)
  @Column({ name: 'target_id' })
  targetId: number;
}
