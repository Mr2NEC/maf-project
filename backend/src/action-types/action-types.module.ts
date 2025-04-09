import { Module } from '@nestjs/common';
import { ActionTypesService } from './action-types.service';
import { ActionTypesResolver } from './action-types.resolver';
import { ActionType } from './entities/action-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ActionType])],
  providers: [ActionTypesResolver, ActionTypesService],
  exports: [ActionTypesService],
})
export class ActionTypesModule {}
