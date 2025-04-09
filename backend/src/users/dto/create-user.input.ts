import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional, Length, MaxDate, MaxLength } from 'class-validator';
import { CreateSocialInput } from 'src/socials/dto/create-social.input';

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: true })
  @MaxLength(50)
  username?: string;

  @Field()
  @IsOptional()
  @MaxLength(30)
  firstName: string;

  @Field()
  @IsOptional()
  @MaxLength(30)
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxDate(new Date())
  birthdate?: Date;

  @Field(() => Int, { nullable: true })
  clubId?: number;

  @Field(() => [CreateSocialInput], { nullable: true })
  socials?: CreateSocialInput[];
}
