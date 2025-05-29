import { CreateProfileInput } from 'src/profiles/dto/create-profile.input';
import { CreateUserInput } from './create-user.input';
import {
  InputType,
  Field,
  Int,
  PartialType,
  IntersectionType,
} from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';

@InputType()
export class UpdateUserInput extends PartialType(
  IntersectionType(CreateUserInput, CreateProfileInput),
) {
  @Field(() => Int)
  id: number;

  @IsEnum(UserRole)
  @Field(() => UserRole)
  role: UserRole;
}
