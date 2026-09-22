import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsResolver } from './actions.resolver';
import { ActionsService } from './actions.service';
import { Action } from './entities/action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Action])],
  providers: [ActionsResolver, ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}
