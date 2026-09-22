import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ClubOwnersService } from './club-owners.service';
import { ClubOwner } from './entities/club-owner.entity';
import { CreateClubOwnerInput } from './dto/create-club-owner.input';
@Resolver(() => ClubOwner)
export class ClubOwnersResolver {
  constructor(private readonly clubOwnerService: ClubOwnersService) {}

  @Roles(UserRole.ADMIN)
  @Mutation(() => ClubOwner)
  createClubOwner(
    @Args('input') input: CreateClubOwnerInput,
  ): Promise<ClubOwner> {
    return this.clubOwnerService.create(input);
  }

  @Public()
  @Query(() => [ClubOwner], { name: 'clubOwner' })
  findAll() {
    return this.clubOwnerService.findAll();
  }
}
