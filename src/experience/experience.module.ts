import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceLoader } from './experience.loader';

@Module({
  providers: [ExperienceService, ExperienceLoader],
  exports: [ExperienceLoader],
})
export class ExperienceModule {}
