import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillLoader } from './skill.loader';

@Module({
  providers: [SkillService, SkillLoader],
  exports: [SkillLoader],
})
export class SkillModule {}
