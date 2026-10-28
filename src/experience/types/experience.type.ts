import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DateTimeScalar } from '../../common/scalars/date.scalar';

@ObjectType()
export class Experience {
  @Field(() => ID)
  id: string;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field(() => DateTimeScalar)
  startDate: Date;

  @Field(() => DateTimeScalar, { nullable: true })
  endDate?: Date | null;

  @Field(() => [String])
  achievements: string[];

  @Field(() => [String])
  stack: string[];
}
