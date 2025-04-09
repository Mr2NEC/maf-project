import { Field, ObjectType } from '@nestjs/graphql';
import { ClubOwner } from 'src/club-owners/entities/club-owner.entity';
import { Place } from 'src/places/entities/place.entity';
import { Social } from 'src/socials/entities/social.entity';
import { User } from 'src/users/entities/user.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'clubs' })
export class Club {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  imgSrc: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  region: string;

  @Field(() => ClubOwner)
  @ManyToOne(() => ClubOwner, owner => owner.clubs)
  owner: ClubOwner;

  @Field(() => Place)
  @ManyToOne(() => Place, place => place.clubs)
  place: Place;

  @Field(() => [Social])
  @OneToMany(() => Social, social => social.club)
  socials: Social[];

  @Field(() => [User])
  @OneToMany(() => User, user => user.club)
  users: User[];
}
