import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @Field()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @NotContains(' ', { message: 'password must not contain spaces' })
  password: string;
}
