import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';
import { NotFoundException } from '@nestjs/common';
import { CreatePlayerInput } from './dto/create-player.input';
import { UpdatePlayerInput } from './dto/update-player.input';

@Resolver(of => Player)
export class PlayersResolver {
  constructor(private readonly playersService: PlayersService) {}

  @Query(returns => Player, { name: 'player' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.playersService.findOne(id);
  }

  @Query(returns => [Player], { name: 'players' })
  findAll(): Promise<Player[]> {
    return this.playersService.findAll();
  }

  @Mutation(returns => Player)
  async createPlayer(
    @Args('createPlayerInput') createPlayerInput: CreatePlayerInput,
  ): Promise<Player> {
    return this.playersService.create(createPlayerInput);
  }

  @Mutation(returns => Boolean)
  async removePlayer(@Args('id') id: number) {
    return this.playersService.remove(id);
  }

  @Mutation(returns => Player)
  async updatePlayer(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePlayerInput') data: UpdatePlayerInput,
  ) {
    return this.playersService.update(id, data);
  }
}
