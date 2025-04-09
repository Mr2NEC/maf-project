import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClubsService } from './clubs.service';
import { Club } from './entities/club.entity';
import { CreateClubInput } from './dto/create-club.input';

@Resolver(() => Club)
export class ClubsResolver {
  constructor(private readonly clubsService: ClubsService) {}

  @Mutation(() => Club)
  createClub(@Args('input') input: CreateClubInput): Promise<Club> {
    return this.clubsService.create(input);
  }

  @Query(() => [Club])
  findAllClubs(): Promise<Club[]> {
    return this.clubsService.findAll();
  }

  @Query(() => Club)
  findOneClub(@Args('id') id: number): Promise<Club | null> {
    return this.clubsService.findOne(id);
  }
}
