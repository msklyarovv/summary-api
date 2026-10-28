import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PROFILE_SEED } from './seed.data';

/**
 * Автоматически заполняет БД при первом запуске.
 * Идемпотентен — проверяет наличие данных перед вставкой.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const exists = await this.prisma.profile.findFirst({ select: { id: true } });

    if (exists) {
      this.logger.log('Данные уже существуют — seed пропущен.');
      return;
    }

    this.logger.log('Заполняем БД начальными данными...');
    await this.prisma.profile.create({ data: PROFILE_SEED });
    this.logger.log('✅ Seed выполнен успешно.');
  }
}
