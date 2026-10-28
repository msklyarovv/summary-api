import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Experience } from '@prisma/client';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileIds(profileIds: string[]): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { profileId: { in: profileIds } },
      orderBy: { order: 'asc' },
    });
  }
}
