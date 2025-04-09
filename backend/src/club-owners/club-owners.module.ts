import { Module } from '@nestjs/common';
import { ClubOwnersService } from './club-owners.service';
import { ClubOwnersResolver } from './club-owners.resolver';
import { ClubOwner } from './entities/club-owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ClubOwner])],
  providers: [ClubOwnersResolver, ClubOwnersService],
  exports: [ClubOwnersService],
})
export class ClubOwnersModule {}
