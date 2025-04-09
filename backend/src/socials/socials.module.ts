import { Module } from '@nestjs/common';
import { SocialsService } from './socials.service';
import { SocialsResolver } from './socials.resolver';
import { Social } from './entities/social.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Social])],
  providers: [SocialsResolver, SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
