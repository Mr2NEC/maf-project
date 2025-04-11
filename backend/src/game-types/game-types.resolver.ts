import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameTypesService } from './game-types.service';
import { GameType } from './entities/game-type.entity';
import { CreateGameTypeInput } from './dto/create-game-type.input';
import { UpdateGameTypeInput } from './dto/update-game-type.input';

@Resolver(() => GameType)
export class GameTypesResolver {
  constructor(private readonly gameTypesService: GameTypesService) {}

  @Mutation(() => GameType, { name: 'createGameType' })
  create(@Args('data') data: CreateGameTypeInput) {
    return this.gameTypesService.create(data);
  }

  @Query(() => [GameType], { name: 'gameTypes' })
  findAll() {
    return this.gameTypesService.findAll();
  }

  @Query(() => GameType, { name: 'gameType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gameTypesService.findOne(id);
  }

  @Mutation(() => GameType, { name: 'updateGameType' })
  update(@Args('id') id: number, @Args('data') data: UpdateGameTypeInput) {
    return this.gameTypesService.update(id, { ...data });
  }

  @Mutation(() => GameType, { name: 'removeGameType' })
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.gameTypesService.remove(id);
  }
}
