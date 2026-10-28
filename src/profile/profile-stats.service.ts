import { Injectable } from '@nestjs/common';
import { ProfileStats } from './types/profile-stats.type';

/**
 * In-memory счётчик просмотров профиля.
 *
 * Singleton (scope по умолчанию) — один экземпляр на всё приложение.
 * При перезапуске счётчик сбрасывается.
 *
 * Следующий шаг: реализовать через ICacheService + Redis,
 * чтобы данные пережили рестарт и корректно агрегировались при scaling.
 */
@Injectable()
export class ProfileStatsService {
  private viewCount = 0;
  private lastViewedAt: Date | null = null;

  recordView(): void {
    this.viewCount++;
    this.lastViewedAt = new Date();
  }

  getStats(): ProfileStats {
    return {
      viewCount: this.viewCount,
      lastViewedAt: this.lastViewedAt,
    };
  }
}
