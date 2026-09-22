import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { ClubsService } from './clubs.service';
import { CreateClubInput } from './dto/create-club.input';
import { UpdateClubInput } from './dto/update-club.input';
import { Club } from './entities/club.entity';
import { RatingRules } from './entities/rating-rules';

@Resolver(() => Club)
export class ClubsResolver {
  constructor(private readonly clubsService: ClubsService) {}

  @Public()
  @Query(() => [Club])
  clubs(
    @Args() pagination: PaginationArgs,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<Club[]> {
    return this.clubsService.findAll(pagination, search);
  }

  @Public()
  @Query(() => Club)
  club(@Args('id', { type: () => Int }) id: number): Promise<Club> {
    return this.clubsService.findOne(id);
  }

  @Mutation(() => Club)
  createClub(
    @CurrentUser() user: JwtUser,
    @Args('input') input: CreateClubInput,
  ): Promise<Club> {
    return this.clubsService.create(user, input);
  }

  @Mutation(() => Club)
  updateClub(
    @CurrentUser() user: JwtUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateClubInput,
  ): Promise<Club> {
    return this.clubsService.update(user, id, input);
  }

  @Mutation(() => Club)
  updateRatingRules(
    @CurrentUser() user: JwtUser,
    @Args('clubId', { type: () => Int }) clubId: number,
    @Args('rules') rules: RatingRules,
  ): Promise<Club> {
    return this.clubsService.updateRatingRules(user, clubId, rules);
  }
}
