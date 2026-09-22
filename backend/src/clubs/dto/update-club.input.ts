import { InputType, PartialType } from '@nestjs/graphql';
import { CreateClubInput } from './create-club.input';

@InputType()
export class UpdateClubInput extends PartialType(CreateClubInput) {}
