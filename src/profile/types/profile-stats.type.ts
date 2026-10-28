import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ProfileStats {
  @Field(() => Int)
  viewCount: number;

  @Field(() => Date, { nullable: true })
  lastViewedAt: Date | null;
}
