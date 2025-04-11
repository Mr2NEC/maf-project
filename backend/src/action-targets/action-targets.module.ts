import { Module } from '@nestjs/common';
import { ActionTargetsService } from './action-targets.service';
import { ActionTargetsResolver } from './action-targets.resolver';
import { ActionTarget } from './entities/action-target.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActionTarget]), PlayersModule],
  providers: [ActionTargetsResolver, ActionTargetsService],
  exports: [ActionTargetsService],
})
export class ActionTargetsModule {}
