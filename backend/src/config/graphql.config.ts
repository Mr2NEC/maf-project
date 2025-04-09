import { registerAs } from '@nestjs/config';

export const graphqlConfig = registerAs('graphql', () => ({
  debug: process.env.GRAPHQL_DEBUG === 'true',
  playground: process.env.GRAPHQL_PLAYGROUND === 'true',
}));
