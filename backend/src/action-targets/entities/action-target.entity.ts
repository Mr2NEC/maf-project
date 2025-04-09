import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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
  action: Action;

  @Field(() => Player)
  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  target: Player;
}
