import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ClubOwner } from 'src/club-owners/entities/club-owner.entity';
import { ClubMember } from 'src/club-members/entities/club-member.entity';
import { Place } from 'src/places/entities/place.entity';
import { Social } from 'src/socials/entities/social.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RatingRules } from './rating-rules';

@ObjectType()
@Entity({ name: 'clubs' })
export class Club {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /** City or region, free text */
  @Field()
  @Column()
  region: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  imgSrc: string | null;

  @Field(() => RatingRules)
  // Column names are set in RatingRules (rating_*), so no prefix here
  @Column(() => RatingRules, { prefix: false })
  ratingRules: RatingRules;

  /** Organisation behind the club, from the imported club catalogue */
  @Field(() => ClubOwner, { nullable: true })
  @ManyToOne(() => ClubOwner, owner => owner.clubs, { nullable: true })
  owner: ClubOwner | null;

  @Field(() => Place, { nullable: true })
  @ManyToOne(() => Place, place => place.clubs, { nullable: true })
  place: Place | null;

  @Field(() => [Social])
  @OneToMany(() => Social, social => social.club)
  socials: Social[];

  @OneToMany(() => ClubMember, member => member.club)
  members: ClubMember[];

  /** Legacy single-club link (User.clubId); membership is ClubMember now */
  @OneToMany(() => User, user => user.club)
  users: User[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
