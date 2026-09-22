import { PaginationArgs } from 'src/common/dto/pagination.args';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';

@Resolver()
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Public()
  @Query(() => [Game], { name: 'games' })
  findAll(@Args() pagination: PaginationArgs) {
    return this.gamesService.findAll(pagination);
  }

  @Public()
  @Query(() => Game, { name: 'game' })
  async findOne(@Args('id') id: number) {
    return this.gamesService.findOne(id);
  }

  @Roles(UserRole.HOST)
  @Mutation(() => Game, { name: 'createGame' })
  async create(@Args('data') data: CreateGameInput) {
    return this.gamesService.create(data);
  }

  @Roles(UserRole.HOST)
  @Mutation(() => Game, { name: 'updateGame' })
  async update(@Args('id') id: number, @Args('data') data: UpdateGameInput) {
    return this.gamesService.update(id, data);
  }

  @Roles(UserRole.HOST)
  @Mutation(() => Game, { name: 'deleteGame' })
  async delete(@Args('id') id: number) {
    return this.gamesService.delete(id);
  }
}
