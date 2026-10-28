import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { Profile } from './types/profile.type';
import { Link } from './types/link.type';
import { Skill } from '../skill/types/skill.type';
import { Experience } from '../experience/types/experience.type';
import { Project } from '../project/types/project.type';
import { ProfileService } from './profile.service';
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
    private readonly skillLoader: SkillLoader,
    private readonly experienceLoader: ExperienceLoader,
    private readonly projectLoader: ProjectLoader,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => Profile, { description: 'Профиль разработчика со всеми связанными данными' })
  profile(): Promise<PrismaProfile> {
    return this.profileService.findFirst();
  }

  @ResolveField(() => [Link], { description: 'Ссылки на профессиональные ресурсы' })
  async links(@Parent() profile: PrismaProfile): Promise<PrismaLink[]> {
    return this.prisma.link.findMany({ where: { profileId: profile.id } });
  }

  /**
   * Навыки с опциональным фильтром по категории.
   * Фильтрация выполняется в памяти после батч-загрузки —
   * DataLoader уже сделал один запрос к БД для всех профилей в сессии.
   */
  @ResolveField(() => [Skill], { description: 'Список навыков (опционально по категории)' })
  async skills(
    @Parent() profile: PrismaProfile,
    @Args('category', {
      nullable: true,
      description: 'Фильтр по категории: Frontend, Backend, Mobile, DevOps, Testing, Security, Monitoring',
    })
    category?: string,
  ): Promise<PrismaSkill[]> {
    const skills = await this.skillLoader.load(profile.id);
    return category ? skills.filter((s) => s.category === category) : skills;
  }

  @ResolveField(() => [Experience], { description: 'Опыт работы, сортировка по хронологии' })
  experience(@Parent() profile: PrismaProfile): Promise<PrismaExperience[]> {
    return this.experienceLoader.load(profile.id);
  }

  @ResolveField(() => [Project], { description: 'Проекты' })
  projects(@Parent() profile: PrismaProfile): Promise<PrismaProject[]> {
    return this.projectLoader.load(profile.id);
  }
}
