import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Project } from '@prisma/client';
import { ProjectService } from './project.service';

@Injectable({ scope: Scope.REQUEST })
export class ProjectLoader {
  private readonly loader: DataLoader<string, Project[]>;

  constructor(private readonly projectService: ProjectService) {
    this.loader = new DataLoader<string, Project[]>(
      async (profileIds) => {
        const projects = await this.projectService.findByProfileIds([...profileIds]);
        const byProfileId = this.groupBy(projects, 'profileId');
        return profileIds.map((id) => byProfileId[id] ?? []);
      },
      { cache: true },
    );
  }

  load(profileId: string): Promise<Project[]> {
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
