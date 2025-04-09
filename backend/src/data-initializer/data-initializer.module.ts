import { Module } from '@nestjs/common';
import { DataInitializerResolver } from './data-initializer.resolver';
import { DataInitializerService } from './data-initializer.service';
import { HttpModule } from '@nestjs/axios';
import { ClubsModule } from 'src/clubs/clubs.module';

@Module({
  imports: [HttpModule, ClubsModule],
  providers: [DataInitializerResolver, DataInitializerService],
  exports: [DataInitializerService],
})
export class DataInitializerModule {}
