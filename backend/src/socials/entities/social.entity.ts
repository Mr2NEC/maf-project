import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'socials' })
export class Social {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  link: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'club_id', nullable: true })
  clubId: number;

  @ManyToOne(() => Club, club => club.socials, { nullable: true })
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, user => user.socials, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
