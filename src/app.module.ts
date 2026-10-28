import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from './config/app.config';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './common/cache/cache.module';
import { ProfileModule } from './profile/profile.module';
import { SeedModule } from './seed/seed.module';
import { DateTimeScalar } from './common/scalars/date.scalar';
import { ComplexityPlugin } from './common/plugins/complexity.plugin';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      cache: true,
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('app.throttle.ttl', 60000),
          limit: config.get<number>('app.throttle.limit', 100),
        },
      ],
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('app.nodeEnv') === 'production';
        return {
          autoSchemaFile: true,
          sortSchema: true,
          introspection: config.get<boolean>('app.graphql.introspection', true),
          // Apollo Server 4 по умолчанию включает CSRF-защиту.
          // В production она нужна; в dev отключаем, чтобы Apollo Sandbox работал без заголовков.
          csrfPrevention: isProd,
          // playground: false отключает старый GraphQL Playground.
          // Apollo Sandbox (новый) включается автоматически через landing page.
          playground: false,
          context: ({ req }: { req: Request }) => ({ req }),
        };
      },
    }),

    PrismaModule,
    CacheModule,
    ProfileModule,
    SeedModule,
  ],
  providers: [DateTimeScalar, ComplexityPlugin],
})
export class AppModule {}
