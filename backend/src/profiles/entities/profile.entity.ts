import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'profiles' })
export class Profile {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  birthdate: Date;

  @Field(() => User)
  @OneToOne(() => User, user => user.profile)
  user: User;
}
