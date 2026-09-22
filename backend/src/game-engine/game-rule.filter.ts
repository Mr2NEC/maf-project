import { BadRequestException, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GameRuleError } from './domain/types';

/** Rule violations are the host's input errors: report them as BAD_REQUEST. */
@Catch(GameRuleError)
export class GameRuleFilter implements GqlExceptionFilter {
  catch(exception: GameRuleError) {
    return new BadRequestException(exception.message);
  }
}
