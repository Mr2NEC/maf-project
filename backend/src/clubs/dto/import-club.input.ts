import { Field, InputType } from '@nestjs/graphql';
import { CreateClubOwnerInput } from 'src/club-owners/dto/create-club-owner.input';
import { CreatePlaceInput } from 'src/places/dto/create-place.input';
import { CreateSocialInput } from 'src/socials/dto/create-social.input';

@InputType()
/** A club from the imported catalogue (see `npm run seed:clubs`). */
export class ImportClubInput {
  @Field()
  imgSrc: string;

  @Field()
  title: string;

  @Field()
  region: string;

  @Field(() => CreateClubOwnerInput)
  owner: CreateClubOwnerInput;

  @Field(() => CreatePlaceInput)
  place: CreatePlaceInput;

  @Field(() => [CreateSocialInput])
  socials: CreateSocialInput[];
}
