import { Public } from 'src/auth/decorators/public.decorator';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';

@Resolver(() => Player)
export class PlayersResolver {
  constructor(private readonly playersService: PlayersService) {}

  @Public()
  @Query(() => Player, { name: 'player' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.playersService.findOne(id);
  }

  @Public()
  @Query(() => [Player], { name: 'players' })
  async findAll(): Promise<Player[]> {
    return this.playersService.findAll();
  }
}
