import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Club } from 'src/clubs/entities/club.entity';
import { UserRole } from 'src/enums/user-role.enum';
import { Player } from 'src/players/entities/player.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Social } from 'src/socials/entities/social.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  @Field()
  @IsString()
  username: string;

  @Field()
  @Column()
  email: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  password: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'profile_id', nullable: true })
  profileId: number;

  @Field(() => Profile)
  @OneToOne(() => Profile, profile => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @Field(() => [Social], { defaultValue: [] })
  @OneToMany(() => Social, social => social.user)
  socials: Social[];

  @Field(() => [Player], { defaultValue: [] })
  @OneToMany(() => Player, player => player.user)
  players: Player[];

  @Field(() => Int, { nullable: true })
  @Column({ name: 'club_id', nullable: true })
  clubId: number | null;

  @Field(() => Club, { nullable: true })
  @ManyToOne(() => Club, club => club.users, { nullable: true })
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @CreateDateColumn()
  @Field()
  readonly createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
