import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateActionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
