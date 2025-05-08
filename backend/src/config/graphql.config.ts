import { registerAs } from '@nestjs/config';

export interface GraphQLConfig {
  debug: boolean;
  playground: boolean;
  introspection: boolean;
  autoSchemaFile: string;
  sortSchema: boolean;
  path: string;
  cors: boolean;
  context: boolean;
}

export const graphqlConfig = registerAs<GraphQLConfig>('graphql', () => ({
  debug: process.env.GRAPHQL_DEBUG === 'true',
  playground: process.env.GRAPHQL_PLAYGROUND === 'true',
  introspection: process.env.GRAPHQL_INTROSPECTION === 'true',
  autoSchemaFile: process.env.GRAPHQL_SCHEMA_PATH || 'src/schema.gql',
  sortSchema: process.env.GRAPHQL_SORT_SCHEMA === 'true',
  path: process.env.GRAPHQL_PATH || '/graphql',
  cors: process.env.GRAPHQL_CORS === 'true',
  context: process.env.GRAPHQL_CONTEXT === 'true',
}));
