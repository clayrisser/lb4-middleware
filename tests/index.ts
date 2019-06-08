import { Request, Response, RequestContext } from '@loopback/rest';
import middleware, { NextFunction } from '../src';

describe('middleware()', () => {
  it('should run middleware', async () => {
    const request = {} as Request;
    const response = {} as Response;
    const context = { request, response } as RequestContext;
    const result = await middleware(context, [
      (_req: Request, _res: Response, next: NextFunction) => {
        return next(null, 'hello');
      }
    ]);
    expect(result).toBe('hello');
  });
});
