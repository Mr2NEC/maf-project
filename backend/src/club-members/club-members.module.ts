import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/clubs/entities/club.entity';
import { ClubAccessService } from './club-access.service';
import { ClubMembersResolver } from './club-members.resolver';
import { ClubMembersService } from './club-members.service';
import { ClubMember } from './entities/club-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubMember, Club])],
  providers: [ClubMembersResolver, ClubMembersService, ClubAccessService],
  exports: [ClubMembersService, ClubAccessService],
})
export class ClubMembersModule {}
