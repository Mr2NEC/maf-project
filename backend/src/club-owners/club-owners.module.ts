import { Module, forwardRef } from '@nestjs/common';
import { ClubOwnersService } from './club-owners.service';
import { ClubOwnersResolver } from './club-owners.resolver';
import { ClubOwner } from './entities/club-owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsModule } from 'src/clubs/clubs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClubOwner]),
    forwardRef(() => ClubsModule),
  ],
  providers: [ClubOwnersResolver, ClubOwnersService],
  exports: [ClubOwnersService],
})
export class ClubOwnersModule {}
