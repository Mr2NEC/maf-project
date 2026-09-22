import { Module, forwardRef } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsResolver } from './clubs.resolver';
import { Club } from './entities/club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubOwnersModule } from 'src/club-owners/club-owners.module';
import { SocialsModule } from 'src/socials/socials.module';
import { PlacesModule } from 'src/places/places.module';
import { ClubMembersModule } from 'src/club-members/club-members.module';
import { RatingModule } from 'src/rating/rating.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club]),
    forwardRef(() => ClubOwnersModule),
    PlacesModule,
    forwardRef(() => SocialsModule),
    ClubMembersModule,
    RatingModule,
  ],
  providers: [ClubsResolver, ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
