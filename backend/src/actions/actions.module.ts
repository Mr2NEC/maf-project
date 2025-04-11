import { Module, forwardRef } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsResolver } from './actions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { ActionTargetsModule } from 'src/action-targets/action-targets.module';
import { ActionTypesModule } from 'src/action-types/action-types.module';
import { PlayersModule } from 'src/players/players.module';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action]),
    forwardRef(() => ActionTargetsModule),
    ActionTypesModule,
    PlayersModule,
    GamesModule,
  ],
  providers: [ActionsResolver, ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}
