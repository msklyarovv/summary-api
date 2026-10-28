import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'Дата и время в формате ISO 8601';

  parseValue(value: unknown): Date {
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('DateTime должен быть строкой или числом');
    }
    return new Date(value);
  }

  serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new Error('DateTime должен быть объектом Date');
    }
    return value.toISOString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('DateTime должен быть строкой в литерале');
  }
}
