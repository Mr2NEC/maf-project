import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'club-owners' })
export class ClubOwner {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  link: string;

  @Field(() => [Club], { nullable: true })
  @OneToMany(() => Club, club => club.owner)
  clubs: Club[];
}
