import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3000);
  const nodeEnv = config.get<string>('app.nodeEnv', 'development');

  const apolloSandboxHosts = [
    'https://apollo-server-landing-page.cdn.apollographql.com',
    'https://embeddable-sandbox.cdn.apollographql.com',
    'https://embeddable-explorer.cdn.apollographql.com',
    'https://sandbox.embed.apollographql.com',
  ];

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc:  ["'self'", ...apolloSandboxHosts],
          scriptSrc:   ["'self'", "'unsafe-inline'", ...apolloSandboxHosts],
          styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', ...apolloSandboxHosts],
          fontSrc:     ["'self'", 'https://fonts.gstatic.com', ...apolloSandboxHosts],
          imgSrc:      ["'self'", 'data:', ...apolloSandboxHosts],
          connectSrc:  ["'self'", ...apolloSandboxHosts],
          manifestSrc: ["'self'", ...apolloSandboxHosts],
          frameSrc:    ["'self'", ...apolloSandboxHosts],
        },
      },
    }),
  );

  app.enableCors({
    origin: nodeEnv === 'production' ? false : '*',
    methods: ['GET', 'POST'],
  });

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Приложение запущено: http://localhost:${port}/graphql`);
}

bootstrap();
