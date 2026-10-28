import { Plugin } from '@nestjs/apollo';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { GraphQLError } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';
import { ConfigService } from '@nestjs/config';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  private readonly maxComplexity: number;

  constructor(
    private readonly gqlSchemaHost: GraphQLSchemaHost,
    private readonly configService: ConfigService,
  ) {
    this.maxComplexity = this.configService.get<number>('app.graphql.maxComplexity', 50);
  }

  async requestDidStart(): Promise<GraphQLRequestListener<Record<string, unknown>>> {
    const { schema } = this.gqlSchemaHost;
    const { maxComplexity } = this;

    return {
      async didResolveOperation({ request, document }) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName ?? undefined,
          query: document,
          variables: request.variables ?? {},
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        if (complexity > maxComplexity) {
          throw new GraphQLError(
            `Запрос слишком сложный: ${complexity}. Максимально допустимо: ${maxComplexity}.`,
            { extensions: { code: 'QUERY_TOO_COMPLEX', complexity, maxComplexity } },
          );
        }
      },
    };
  }
}
