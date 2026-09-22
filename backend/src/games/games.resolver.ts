import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';

@Resolver()
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => [Game], { name: 'games' })
  async findAll() {
    return this.gamesService.findAll();
  }

  @Query(() => Game, { name: 'game' })
  async findOne(@Args('id') id: number) {
    return this.gamesService.findOne(id);
  }

  @Mutation(() => Game, { name: 'createGame' })
  async create(@Args('data') data: CreateGameInput) {
    return this.gamesService.create(data);
  }

  @Mutation(() => Game, { name: 'updateGame' })
  async update(@Args('id') id: number, @Args('data') data: UpdateGameInput) {
    return this.gamesService.update(id, data);
  }

  @Mutation(() => Game, { name: 'deleteGame' })
  async delete(@Args('id') id: number) {
    return this.gamesService.delete(id);
  }
}
