import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameTypesService } from './game-types.service';
import { GameType } from './entities/game-type.entity';
import { CreateGameTypeInput } from './dto/create-game-type.input';
import { UpdateGameTypeInput } from './dto/update-game-type.input';

@Resolver(() => GameType)
export class GameTypesResolver {
  constructor(private readonly gameTypesService: GameTypesService) {}

  @Roles(UserRole.ADMIN)
  @Mutation(() => GameType, { name: 'createGameType' })
  create(@Args('data') data: CreateGameTypeInput) {
    return this.gameTypesService.create(data);
  }

  @Public()
  @Query(() => [GameType], { name: 'gameTypes' })
  findAll() {
    return this.gameTypesService.findAll();
  }

  @Public()
  @Query(() => GameType, { name: 'gameType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gameTypesService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => GameType, { name: 'updateGameType' })
  update(@Args('id') id: number, @Args('data') data: UpdateGameTypeInput) {
    return this.gameTypesService.update(id, { ...data });
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => GameType, { name: 'removeGameType' })
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.gameTypesService.remove(id);
  }
}
