import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { CreateSocialInput } from 'src/socials/dto/create-social.input';

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: true })
  @MaxLength(50)
  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  @Field()
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  password: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @ValidateIf(o => o.clubId !== undefined)
  @IsInt()
  clubId?: number;

  @Field(() => [CreateSocialInput], { nullable: true })
  socials?: CreateSocialInput[];
}
