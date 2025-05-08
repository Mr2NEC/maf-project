import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BooleanResponse {
  @Field()
  success: boolean;
}
