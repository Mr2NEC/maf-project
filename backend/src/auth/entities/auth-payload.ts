import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/enums/user-role.enum';

@ObjectType()
export class AuthPayload {
  @Field(() => Int)
  userId: number;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => String)
  accessToken: string;

  //   @Field(() => String)
  //   refreshToken: string;
}
