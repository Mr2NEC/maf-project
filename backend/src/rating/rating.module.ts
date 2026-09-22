import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { RatingResolver } from './rating.resolver';
import { RatingPointsService } from './rating-points.service';
import { RatingService } from './rating.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player, User])],
  providers: [RatingResolver, RatingService, RatingPointsService],
  exports: [RatingPointsService],
})
export class RatingModule {}
