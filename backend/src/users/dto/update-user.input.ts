import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateSocialInput } from 'src/socials/dto/create-social.input';

/**
 * Fields a user may change about themselves.
 * Role, email, password and club membership are changed through dedicated flows.
 */
@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(30)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(30)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxDate(() => new Date())
  birthdate?: Date;

  @Field(() => [CreateSocialInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSocialInput)
  socials?: CreateSocialInput[];
}
