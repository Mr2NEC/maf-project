import { Resolver } from '@nestjs/graphql';
import { GamesService } from './games.service';

@Resolver()
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}
}
