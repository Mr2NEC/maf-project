import { Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';

@Resolver()
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}
}
