import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ClubOwnersService } from './club-owners.service';
import { ClubOwner } from './entities/club-owner.entity';
import { CreateClubOwnerInput } from './dto/create-club-owner.input';
@Resolver(() => ClubOwner)
export class ClubOwnersResolver {
  constructor(private readonly clubOwnerService: ClubOwnersService) {}

  @Mutation(() => ClubOwner)
  createClubOwner(
    @Args('input') input: CreateClubOwnerInput,
  ): Promise<ClubOwner> {
    return this.clubOwnerService.create(input);
  }

  @Query(() => [ClubOwner], { name: 'clubOwner' })
  findAll() {
    return this.clubOwnerService.findAll();
  }
}
