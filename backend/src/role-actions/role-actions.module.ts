import { Module } from '@nestjs/common';
import { RoleActionsService } from './role-actions.service';
import { RoleActionsResolver } from './role-actions.resolver';
import { RoleAction } from './entities/role-action.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoleAction])],
  providers: [RoleActionsResolver, RoleActionsService],
  exports: [RoleActionsService],
})
export class RoleActionsModule {}
