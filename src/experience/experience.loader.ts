import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Experience } from '@prisma/client';
import { ExperienceService } from './experience.service';
import { groupBy } from '../common/utils/group-by.util';

@Injectable({ scope: Scope.REQUEST })
export class ExperienceLoader {
  private readonly loader: DataLoader<string, Experience[]>;

  constructor(private readonly experienceService: ExperienceService) {
    this.loader = new DataLoader<string, Experience[]>(async (profileIds) => {
      const experience = await this.experienceService.findByProfileIds([...profileIds]);
      const byProfileId = groupBy(experience, 'profileId');
      return profileIds.map((id) => byProfileId[id] ?? []);
    });
  }

  load(profileId: string): Promise<Experience[]> {
    return this.loader.load(profileId);
  }
}
