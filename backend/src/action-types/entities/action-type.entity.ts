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

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
