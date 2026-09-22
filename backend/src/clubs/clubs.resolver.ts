import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClubsService } from './clubs.service';
import { Club } from './entities/club.entity';
import { CreateClubInput } from './dto/create-club.input';

@Resolver(() => Club)
export class ClubsResolver {
  constructor(private readonly clubsService: ClubsService) {}

  @Roles(UserRole.ADMIN)
  @Mutation(() => Club)
  createClub(@Args('input') input: CreateClubInput): Promise<Club> {
    return this.clubsService.create(input);
  }

  @Public()
  @Query(() => [Club])
  findAllClubs(): Promise<Club[]> {
    return this.clubsService.findAll();
  }

  @Public()
  @Query(() => Club)
  findOneClub(@Args('id') id: number): Promise<Club | null> {
    return this.clubsService.findOne(id);
  }
}
