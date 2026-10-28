import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Skill } from '@prisma/client';
import { SkillService } from './skill.service';
import { groupBy } from '../common/utils/group-by.util';

/**
 * DataLoader решает N+1 проблему для навыков.
 *
 * Scope.REQUEST — каждый GraphQL-запрос получает чистый экземпляр.
 * Без этого кэш DataLoader может утечь между запросами разных пользователей.
 *
 * Точка роста: добавить cross-request кэширование через Redis
 * (ICacheService уже абстрагирован в CacheModule).
 */
@Injectable({ scope: Scope.REQUEST })
export class SkillLoader {
  private readonly loader: DataLoader<string, Skill[]>;

  constructor(private readonly skillService: SkillService) {
    this.loader = new DataLoader<string, Skill[]>(async (profileIds) => {
      const skills = await this.skillService.findByProfileIds([...profileIds]);
      const byProfileId = groupBy(skills, 'profileId');
      return profileIds.map((id) => byProfileId[id] ?? []);
    });
  }

  load(profileId: string): Promise<Skill[]> {
    return this.loader.load(profileId);
  }
}
