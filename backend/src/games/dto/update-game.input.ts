import { InputType, PartialType } from '@nestjs/graphql';
import { CreateGameInput } from './create-game.input';

/**
 * Only scheduling details can be edited, and only before the game starts.
 * Status, phase and round are driven by the game engine.
 */
@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {}
