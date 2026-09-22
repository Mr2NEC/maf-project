import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Club } from 'src/clubs/entities/club.entity';
import { ClubRole } from 'src/enums/club-role.enum';
import { MembershipStatus } from 'src/enums/membership-status.enum';
import { User } from 'src/users/entities/user.entity';

/** A user's membership in a club: pending request or active member with a role. */
@ObjectType()
@Entity({ name: 'club_members' })
@Unique('UQ_club_members_club_user', ['clubId', 'userId'])
export class ClubMember {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ name: 'club_id' })
  clubId: number;

  @Field(() => Club)
  @ManyToOne(() => Club, club => club.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Field(() => Int)
  @Column({ name: 'user_id' })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => ClubRole)
  @Column({ type: 'enum', enum: ClubRole, default: ClubRole.MEMBER })
  role: ClubRole;

  @Field(() => MembershipStatus)
  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.PENDING,
  })
  status: MembershipStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
