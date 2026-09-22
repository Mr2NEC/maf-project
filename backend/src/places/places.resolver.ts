import { Public } from 'src/auth/decorators/public.decorator';
import { Resolver, Query } from '@nestjs/graphql';
import { PlacesService } from './places.service';
import { Place } from './entities/place.entity';

@Resolver(() => Place)
export class PlacesResolver {
  constructor(private readonly placeService: PlacesService) {}

  @Public()
  @Query(() => [Place], { name: 'place' })
  findAll() {
    return this.placeService.findAll();
  }
}
