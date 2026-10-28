import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Skill {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  /** Категория: Frontend, Backend, Mobile, DevOps, Testing, Security, Monitoring */
  @Field()
  category: string;
}
