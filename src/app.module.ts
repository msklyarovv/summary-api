import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from './config/app.config';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './common/cache/cache.module';
import { ProfileModule } from './profile/profile.module';
import { HealthModule } from './health/health.module';
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
      useFactory: (config: ConfigService) => ({
        autoSchemaFile: true,
        sortSchema: true,
        introspection: config.get<boolean>('app.graphql.introspection', true),
        csrfPrevention: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
        context: ({ req }: { req: Request }) => ({ req }),
        formatError: (error) => {
          // В production скрываем внутренние детали ошибок
          const isInternal =
            error.extensions?.code === 'INTERNAL_SERVER_ERROR' &&
            config.get('app.nodeEnv') === 'production';

          return isInternal
            ? { message: 'Внутренняя ошибка сервера', extensions: { code: 'INTERNAL_SERVER_ERROR' } }
            : error;
        },
      }),
    }),

    PrismaModule,
    CacheModule,
    ProfileModule,
    HealthModule,
    SeedModule,
  ],
  providers: [DateTimeScalar, ComplexityPlugin],
})
export class AppModule {}
