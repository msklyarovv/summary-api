import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Skill } from '@prisma/client';
import { SkillService } from './skill.service';

/**
 * DataLoader для батч-загрузки навыков по profileId.
 *
 * Scope.REQUEST гарантирует, что каждый GraphQL-запрос получает собственный
 * экземпляр загрузчика с чистым кэшем — без утечки данных между запросами.
 *
 * Как это работает:
 * Если в одном запросе несколько резолверов вызывают load(profileId),
 * DataLoader группирует вызовы в один батч и делает ровно один SELECT.
 */
@Injectable({ scope: Scope.REQUEST })
export class SkillLoader {
  private readonly loader: DataLoader<string, Skill[]>;

  constructor(private readonly skillService: SkillService) {
    this.loader = new DataLoader<string, Skill[]>(
      async (profileIds) => {
        const skills = await this.skillService.findByProfileIds([...profileIds]);
        const byProfileId = this.groupBy(skills, 'profileId');
        return profileIds.map((id) => byProfileId[id] ?? []);
      },
      { cache: true },
    );
  }

  load(profileId: string): Promise<Skill[]> {
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
