import { Public } from 'src/auth/decorators/public.decorator';
import { Resolver, Query } from '@nestjs/graphql';
import { SocialsService } from './socials.service';
import { Social } from './entities/social.entity';

@Resolver(() => Social)
export class SocialsResolver {
  constructor(private readonly socialService: SocialsService) {}

  @Public()
  @Query(() => [Social], { name: 'social' })
  findAll() {
    return this.socialService.findAll();
  }
}
