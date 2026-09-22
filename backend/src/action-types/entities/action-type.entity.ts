import { ActionEffect } from 'src/enums/action-effect.enum';
import { GamePhase } from 'src/enums/game-phase.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'action_types' })
export class ActionType {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  /** How the game engine resolves this action */
  @Field(() => ActionEffect)
  @Column({ type: 'enum', enum: ActionEffect, default: ActionEffect.NOTE })
  effect: ActionEffect;

  /** When the action may be used; null means any phase */
  @Field(() => GamePhase, { nullable: true })
  @Column({ type: 'enum', enum: GamePhase, nullable: true })
  phase: GamePhase | null;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
