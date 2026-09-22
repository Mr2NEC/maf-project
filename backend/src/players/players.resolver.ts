import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { GameStatus } from 'src/enums/game-status.enum';
import { UserRole } from 'src/enums/user-role.enum';
import { Game } from 'src/games/entities/game.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Player } from './entities/player.entity';
import { PlayersService } from './players.service';

/** Roles are public once the game is over. */
const REVEALED_STATUSES = [GameStatus.FINISHED, GameStatus.CANCELLED];

@Resolver(() => Player)
export class PlayersResolver {
  constructor(
    private readonly playersService: PlayersService,
    @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
  ) {}

  @Public()
  @Query(() => Player, { name: 'player' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.playersService.findOne(id);
  }

  @Public()
  @Query(() => [Player], { name: 'players' })
  findAll(@Args() { skip, take }: PaginationArgs): Promise<Player[]> {
    return this.playersService.findAll({ skip, take, order: { id: 'ASC' } });
  }

  /** Hidden from players and spectators while the game is running. */
  @ResolveField('role', () => Role, { nullable: true })
  async role(@Parent() player: Player, @CurrentUser() user?: JwtUser) {
    return (await this.canSeeRole(player, user)) ? player.role : null;
  }

  @ResolveField('roleId', () => Int, { nullable: true })
  async roleId(@Parent() player: Player, @CurrentUser() user?: JwtUser) {
    return (await this.canSeeRole(player, user)) ? player.roleId : null;
  }

  private async canSeeRole(player: Player, user?: JwtUser): Promise<boolean> {
    if (user?.role === UserRole.ADMIN || user?.role === UserRole.HOST) {
      return true;
    }
    // TODO(stage 3): batch with a DataLoader, this runs once per player
    const status =
      player.game?.status ??
      (
        await this.gamesRepository.findOne({
          where: { id: player.gameId },
          select: { id: true, status: true },
        })
      )?.status;
    return status !== undefined && REVEALED_STATUSES.includes(status);
  }
}
