import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Project } from '@prisma/client';
import { ProjectService } from './project.service';
import { groupBy } from '../common/utils/group-by.util';

@Injectable({ scope: Scope.REQUEST })
export class ProjectLoader {
  private readonly loader: DataLoader<string, Project[]>;

  constructor(private readonly projectService: ProjectService) {
    this.loader = new DataLoader<string, Project[]>(async (profileIds) => {
      const projects = await this.projectService.findByProfileIds([...profileIds]);
      const byProfileId = groupBy(projects, 'profileId');
      return profileIds.map((id) => byProfileId[id] ?? []);
    });
  }

  load(profileId: string): Promise<Project[]> {
    return this.loader.load(profileId);
  }
}
