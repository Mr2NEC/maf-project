import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Mutation, Resolver } from '@nestjs/graphql';
import { DataInitializerService } from './data-initializer.service';

@Resolver()
export class DataInitializerResolver {
  constructor(
    private readonly dataInitializerService: DataInitializerService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Mutation(() => String)
  async initializeDatabaseClubs(): Promise<string> {
    await this.dataInitializerService.initializeClubs();
    return 'Clubs database initialization started successfully!';
  }
}
