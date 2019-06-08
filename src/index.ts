import { RequestContext } from '@loopback/rest';
import MiddlewareRunner, {
  DeepArray,
  ErrorRequestHandler,
  NextFunction,
  RequestHandler
} from 'middleware-runner';

export default async function middleware<Result>(
  context: RequestContext,
  unflattenedMiddlewares: DeepArray<RequestHandler | ErrorRequestHandler>
): Promise<Result> {
  const { request, response } = context;
  const middlewareRunner = new MiddlewareRunner<Result>(unflattenedMiddlewares);
  return middlewareRunner.run(request, response);
}

export { NextFunction };
