import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Skill } from '@prisma/client';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Батч-запрос для DataLoader: одним SELECT получаем навыки для нескольких профилей.
   * Фильтр по категории применяется в памяти после батч-загрузки,
   * чтобы не нарушать батчинг DataLoader.
   */
  async findByProfileIds(profileIds: string[]): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: profileIds } },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }
}
