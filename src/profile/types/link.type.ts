import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Link {
  @Field(() => ID)
  id: string;

  /** Человекочитаемое название: «GitHub», «Habr», «Telegram» */
  @Field()
  label: string;

  @Field()
  url: string;
}
