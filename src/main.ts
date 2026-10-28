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

  // CDN-домены, с которых Apollo Sandbox грузит свои ресурсы
  const apolloCdnHosts = [
    'https://apollo-server-landing-page.cdn.apollographql.com',
    'https://embeddable-sandbox.cdn.apollographql.com',
    'https://embeddable-explorer.cdn.apollographql.com',
  ];

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", ...apolloCdnHosts],
          scriptSrc: ["'self'", "'unsafe-inline'", ...apolloCdnHosts],
          styleSrc: ["'self'", "'unsafe-inline'", ...apolloCdnHosts],
          imgSrc: ["'self'", 'data:', ...apolloCdnHosts],
          connectSrc: ["'self'", ...apolloCdnHosts],
          fontSrc: ["'self'", ...apolloCdnHosts],
          manifestSrc: ["'self'", ...apolloCdnHosts],
          frameSrc: ["'self'", ...apolloCdnHosts],
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
