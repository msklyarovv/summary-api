import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3000);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-apollo-operation-name', 'apollo-require-preflight'],
  });

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
          connectSrc:  ["'self'", 'http://localhost:*', ...apolloSandboxHosts],
          manifestSrc: ["'self'", ...apolloSandboxHosts],
          frameSrc:    ["'self'", ...apolloSandboxHosts],
        },
      },
    }),
  );

  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 API запущен: http://localhost:${port}/graphql`);
  logger.log(`❤️  Health check: http://localhost:${port}/health`);
}

bootstrap();
