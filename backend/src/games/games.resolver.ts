import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { CreateGameInput } from './dto/create-game.input';
import { GamesFilterArgs } from './dto/games-filter.args';
import { UpdateGameInput } from './dto/update-game.input';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

/** Club hosts manage their club's games; see ClubAccessService.assertCanHost. */
@Resolver()
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Public()
  @Query(() => [Game], { name: 'games' })
  findAll(@Args() filter: GamesFilterArgs) {
    return this.gamesService.findAll(filter);
  }

  @Public()
  @Query(() => Game, { name: 'game' })
  findOne(@Args('id') id: number) {
    return this.gamesService.findOne(id);
  }

  @Mutation(() => Game, { name: 'createGame' })
  create(@CurrentUser() user: JwtUser, @Args('data') data: CreateGameInput) {
    return this.gamesService.create(user, data);
  }

  @Mutation(() => Game, { name: 'updateGame' })
  update(
    @CurrentUser() user: JwtUser,
    @Args('id') id: number,
    @Args('data') data: UpdateGameInput,
  ) {
    return this.gamesService.update(user, id, data);
  }

  @Mutation(() => Game, { name: 'deleteGame' })
  delete(@CurrentUser() user: JwtUser, @Args('id') id: number) {
    return this.gamesService.delete(user, id);
  }
}
