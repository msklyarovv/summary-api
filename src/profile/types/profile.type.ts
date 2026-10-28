import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Link } from './link.type';
import { Skill } from '../../skill/types/skill.type';
import { Experience } from '../../experience/types/experience.type';
import { Project } from '../../project/types/project.type';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  telegram?: string;

  @Field(() => [Link])
  links: Link[];

  @Field(() => [Skill])
  skills: Skill[];

  @Field(() => [Experience])
  experience: Experience[];

  @Field(() => [Project])
  projects: Project[];
}
