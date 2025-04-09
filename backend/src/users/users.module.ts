import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SocialsModule } from 'src/socials/socials.module';
import { ClubsModule } from 'src/clubs/clubs.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SocialsModule, ClubsModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
