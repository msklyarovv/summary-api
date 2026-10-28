import { Injectable } from '@nestjs/common';
import { ProfileStats } from './types/profile-stats.type';

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
