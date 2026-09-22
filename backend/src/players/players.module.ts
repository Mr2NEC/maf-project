import { Module, forwardRef } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersResolver } from './players.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Game } from 'src/games/entities/game.entity';
import { UsersModule } from 'src/users/users.module';
import { GamesModule } from 'src/games/games.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, Game]),
    UsersModule,
    forwardRef(() => GamesModule),
    forwardRef(() => RolesModule),
  ],
  providers: [PlayersResolver, PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
