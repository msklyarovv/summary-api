import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  graphql: {
    introspection: process.env.GRAPHQL_INTROSPECTION !== 'false',
    playground: process.env.NODE_ENV !== 'production',
    maxComplexity: parseInt(process.env.GRAPHQL_MAX_COMPLEXITY ?? '50', 10),
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
}));

export type AppConfig = ReturnType<typeof appConfig>;
