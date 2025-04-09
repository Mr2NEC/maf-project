import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateClubOwnerInput {
  @Field()
  name: string;

  @Field()
  link: string;
}
