import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectLoader } from './project.loader';

@Module({
  providers: [ProjectService, ProjectLoader],
  exports: [ProjectLoader],
})
export class ProjectModule {}
