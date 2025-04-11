import { InputType, Int, Field } from '@nestjs/graphql';
import { Action } from 'src/actions/entities/action.entity';

@InputType()
export class CreateActionTargetInput {
  @Field(() => Action)
  action: Action;

  @Field(() => Int)
  targetId: number;
}
