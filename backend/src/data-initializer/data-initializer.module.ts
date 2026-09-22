import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClubsModule } from 'src/clubs/clubs.module';
import { DataInitializerService } from './data-initializer.service';

/** Used by CLI scripts only (see src/cli), not exposed through GraphQL. */
@Module({
  imports: [HttpModule, ClubsModule],
  providers: [DataInitializerService],
  exports: [DataInitializerService],
})
export class DataInitializerModule {}
