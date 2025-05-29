import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateProfileInput } from './create-profile.input';

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {}
