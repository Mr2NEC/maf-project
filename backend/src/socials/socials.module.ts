import { Module, forwardRef } from '@nestjs/common';
import { SocialsService } from './socials.service';
import { SocialsResolver } from './socials.resolver';
import { Social } from './entities/social.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsModule } from 'src/clubs/clubs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Social]), forwardRef(() => ClubsModule)],
  providers: [SocialsResolver, SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
