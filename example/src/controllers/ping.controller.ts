import {
  Request,
  RestBindings,
  get,
  ResponseObject,
  Response
} from '@loopback/rest';
import { inject } from '@loopback/context';
import { middleware, NextFunction } from 'lb4-middleware';

const logger = console;

const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          greeting: { type: 'string' },
          date: { type: 'string' },
          url: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' }
            },
            additionalProperties: true
          }
        }
      }
    }
  }
};

export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @middleware('hello', (_req: Request, _res: Response, next: NextFunction) => {
    logger.info('local middleware');
    return next();
  })
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE
    }
  })
  ping(): object {
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers)
    };
  }
}
