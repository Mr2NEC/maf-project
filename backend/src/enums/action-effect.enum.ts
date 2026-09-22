import { registerEnumType } from '@nestjs/graphql';

/**
 * What an action does in the game engine. Action types are data (created by
 * admins), the effect tells the engine how to resolve them.
 */
export enum ActionEffect {
  /** Eliminates the target at the end of the night unless healed */
  KILL = 'kill',
  /** Protects the target from KILL this night */
  HEAL = 'heal',
  /** Reveals the target's team to the host */
  CHECK = 'check',
  /** Cancels the target's own night action */
  BLOCK = 'block',
  /** Day vote against a player (recorded by the engine) */
  VOTE = 'vote',
  /** No effect, only kept in the game log */
  NOTE = 'note',
}

registerEnumType(ActionEffect, { name: 'ActionEffect' });
