import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxDate, MaxLength } from 'class-validator';

@InputType()
export class CreateProfileInput {
  @Field()
  @IsOptional()
  @MaxLength(30)
  firstName?: string;

  @Field()
  @IsOptional()
  @MaxLength(30)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxDate(new Date())
  birthdate?: Date;
}
