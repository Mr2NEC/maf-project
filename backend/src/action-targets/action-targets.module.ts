import { Module } from '@nestjs/common';
import { ActionTargetsService } from './action-targets.service';
import { ActionTargetsResolver } from './action-targets.resolver';

@Module({
  providers: [ActionTargetsResolver, ActionTargetsService],
})
export class ActionTargetsModule {}
