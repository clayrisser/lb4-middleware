import { RequestContext } from '@loopback/rest';
import { inject, Provider, Getter } from '@loopback/context';
import { runMiddleware, Middlewares } from 'middleware-runner';
import {
  MiddlewareAction,
  MiddlewareBindings,
  MiddlewareMetadata
} from '../types';

export class MiddlewareActionProvider<Result>
  implements Provider<MiddlewareAction<Result>> {
  constructor(
    @inject.getter(MiddlewareBindings.Metadata.MIDDLEWARE)
    public getMiddlewareMetadata: Getter<MiddlewareMetadata>
  ) {}

  value(): MiddlewareAction<Result> {
    return (context: RequestContext, middlewares: Middlewares) =>
      this.action(context, middlewares);
  }

  async action(
    context: RequestContext,
    middlewares: Middlewares
  ): Promise<Result> {
    const { request, response } = context;
    return runMiddleware(request, response, middlewares);
  }
}
