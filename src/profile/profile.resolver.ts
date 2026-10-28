import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { Profile } from './types/profile.type';
import { ProfileStats } from './types/profile-stats.type';
import { Link } from './types/link.type';
import { Skill } from '../skill/types/skill.type';
import { Experience } from '../experience/types/experience.type';
import { Project } from '../project/types/project.type';
import { ProfileService } from './profile.service';
import { ProfileStatsService } from './profile-stats.service';
import { SkillLoader } from '../skill/skill.loader';
import { ExperienceLoader } from '../experience/experience.loader';
import { ProjectLoader } from '../project/project.loader';
import { PrismaService } from '../prisma/prisma.service';
import {
  Profile as PrismaProfile,
  Skill as PrismaSkill,
  Experience as PrismaExperience,
  Project as PrismaProject,
  Link as PrismaLink,
} from '@prisma/client';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly statsService: ProfileStatsService,
    private readonly skillLoader: SkillLoader,
    private readonly experienceLoader: ExperienceLoader,
    private readonly projectLoader: ProjectLoader,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => Profile, { description: 'Профиль разработчика' })
  async profile(): Promise<PrismaProfile> {
    this.statsService.recordView();
    return this.profileService.findFirst();
  }

  @Query(() => ProfileStats, { description: 'Статистика просмотров' })
  profileStats(): ProfileStats {
    return this.statsService.getStats();
  }

  @ResolveField(() => [Link])
  async links(@Parent() profile: PrismaProfile): Promise<PrismaLink[]> {
    return this.prisma.link.findMany({ where: { profileId: profile.id } });
  }

  @ResolveField(() => [Skill], { description: 'Опциональный фильтр: Frontend | Backend | Mobile | DevOps | Testing | Security | Monitoring' })
  async skills(
    @Parent() profile: PrismaProfile,
    @Args('category', { nullable: true }) category?: string,
  ): Promise<PrismaSkill[]> {
    const skills = await this.skillLoader.load(profile.id);
    return category ? skills.filter((s) => s.category === category) : skills;
  }

  @ResolveField(() => [Experience])
  experience(@Parent() profile: PrismaProfile): Promise<PrismaExperience[]> {
    return this.experienceLoader.load(profile.id);
  }

  @ResolveField(() => [Project])
  projects(@Parent() profile: PrismaProfile): Promise<PrismaProject[]> {
    return this.projectLoader.load(profile.id);
  }
}
