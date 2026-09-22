import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateGameInput } from './create-game.input';

/**
 * Only scheduling details can be edited, and only before the game starts.
 * Club and tournament are fixed; status, phase and round are driven by the
 * game engine.
 */
@InputType()
export class UpdateGameInput extends PartialType(
  PickType(CreateGameInput, ['startDate', 'gameTypeId'] as const),
) {}
