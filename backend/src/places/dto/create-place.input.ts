import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePlaceInput {
  @Field()
  country: string;

  @Field()
  city: string;
}
