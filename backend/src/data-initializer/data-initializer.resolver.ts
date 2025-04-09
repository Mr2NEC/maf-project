import { Mutation, Resolver } from '@nestjs/graphql';
import { DataInitializerService } from './data-initializer.service';

@Resolver()
export class DataInitializerResolver {
  constructor(
    private readonly dataInitializerService: DataInitializerService,
  ) {}

  @Mutation(() => String)
  async initializeDatabaseClubs(): Promise<string> {
    await this.dataInitializerService.initializeClubs();
    return 'Clubs database initialization started successfully!';
  }
}
