import { Module, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameTypesModule } from 'src/game-types/game-types.module';
import { PlayersModule } from 'src/players/players.module';
import { DateUtils } from 'src/shared/utils/date.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    GameTypesModule,
    forwardRef(() => PlayersModule),
  ],
  providers: [GamesResolver, GamesService, DateUtils],
  exports: [GamesService],
})
export class GamesModule {}
