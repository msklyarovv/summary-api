import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Experience } from '@prisma/client';
import { ExperienceService } from './experience.service';

@Injectable({ scope: Scope.REQUEST })
export class ExperienceLoader {
  private readonly loader: DataLoader<string, Experience[]>;

  constructor(private readonly experienceService: ExperienceService) {
    this.loader = new DataLoader<string, Experience[]>(
      async (profileIds) => {
        const experience = await this.experienceService.findByProfileIds([...profileIds]);
        const byProfileId = this.groupBy(experience, 'profileId');
        return profileIds.map((id) => byProfileId[id] ?? []);
      },
      { cache: true },
    );
  }

  load(profileId: string): Promise<Experience[]> {
    return this.loader.load(profileId);
  }

  private groupBy<T extends Record<string, unknown>>(
    items: T[],
    key: keyof T,
  ): Record<string, T[]> {
    return items.reduce<Record<string, T[]>>((acc, item) => {
      const groupKey = String(item[key]);
      acc[groupKey] = [...(acc[groupKey] ?? []), item];
      return acc;
    }, {});
  }
}
