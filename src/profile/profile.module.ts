import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { SkillModule } from '../skill/skill.module';
import { ExperienceModule } from '../experience/experience.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [SkillModule, ExperienceModule, ProjectModule],
  providers: [ProfileService, ProfileResolver],
})
export class ProfileModule {}
