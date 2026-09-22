import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateClubInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  region: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;
}
