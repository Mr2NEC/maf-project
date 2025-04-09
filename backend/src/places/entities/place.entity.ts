import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'places' })
export class Place {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  city: string;

  @OneToMany(() => Club, club => club.place)
  clubs: Club[];
}
