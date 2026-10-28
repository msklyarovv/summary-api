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
        // Публичный read-only API: CSRF не актуален.
        csrfPrevention: false,
        // Не ставим playground: false — он добавляет ApolloServerPluginLandingPageDisabled.
        // Вместо этого явно подключаем встроенный Apollo Sandbox (открывается в браузере).
        plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
        context: ({ req }: { req: Request }) => ({ req }),
      }),
    }),

    PrismaModule,
    CacheModule,
    ProfileModule,
    SeedModule,
  ],
  providers: [DateTimeScalar, ComplexityPlugin],
})
export class AppModule {}
