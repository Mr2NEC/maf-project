import { CreateClubOwnerInput } from './create-club-owner.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClubOwnerInput extends PartialType(CreateClubOwnerInput) {
  @Field(() => Int)
  id: number;
}
