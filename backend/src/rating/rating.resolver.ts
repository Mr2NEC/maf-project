import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators/public.decorator';
import { RatingArgs } from './dto/rating.args';
import { RatingEntry } from './dto/rating-entry';
import { RatingService } from './rating.service';

@Resolver(() => RatingEntry)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Public()
  @Query(() => [RatingEntry])
  rating(@Args() args: RatingArgs) {
    return this.ratingService.rating(args);
  }
}
