import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateSocialInput {
  @Field()
  type: string;

  @Field()
  link: string;

  @Field(() => Int, { nullable: true })
  clubId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;
}
