import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateActionTargetInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
