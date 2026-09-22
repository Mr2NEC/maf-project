import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

@InputType()
export class CreateSocialInput {
  @Field()
  @IsString()
  @MaxLength(30)
  type: string;

  @Field()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(255)
  link: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  clubId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number;
}
