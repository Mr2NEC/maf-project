import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Club } from 'src/clubs/entities/club.entity';
import { Player } from 'src/players/entities/player.entity';
import { Social } from 'src/socials/entities/social.entity';
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
@Entity({ name: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  username?: string;

  @Column()
  @Field()
  @IsOptional()
  @IsString()
  firstName: string;

  @Column()
  @Field()
  @IsOptional()
  @IsString()
  lastName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @Field(() => [Social], { nullable: true })
  @OneToMany(() => Social, social => social.user, { nullable: true })
  socials: Social[];

  @Field(() => [Player], { nullable: true })
  @OneToMany(() => Player, player => player.user, { nullable: true })
  players: Player[];

  @Field(() => Int, { nullable: true })
  @Column({ name: 'club_id', nullable: true })
  clubId: number;

  @Field(() => Club, { nullable: true })
  @ManyToOne(() => Club, club => club.users, { nullable: true })
  @JoinColumn({ name: 'club_id' })
  club?: Club;

  @CreateDateColumn()
  @Field()
  readonly createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
