import { Module } from '@nestjs/common';
import { RoleActionsService } from './role-actions.service';
import { RoleActionsResolver } from './role-actions.resolver';
import { RoleAction } from './entities/role-action.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionTypesModule } from 'src/action-types/action-types.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleAction]),
    ActionTypesModule,
    RolesModule,
  ],
  providers: [RoleActionsResolver, RoleActionsService],
  exports: [RoleActionsService],
})
export class RoleActionsModule {}
