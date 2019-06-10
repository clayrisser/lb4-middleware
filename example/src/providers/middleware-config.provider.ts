import {
  MiddlewareConfig,
  MiddlewareRecord,
  NextFunction
} from 'lb4-middleware';
import { Provider } from '@loopback/context';
import { Request, Response } from '@loopback/rest';

const logger = console;

export class MiddlewareConfigProvider implements Provider<MiddlewareConfig> {
  constructor() {}

  value(): MiddlewareConfig {
    const middlewareRecords: MiddlewareRecord[] = [
      {
        keys: ['hello'],
        chain: [
          (_req: Request, _res: Response, next: NextFunction) => {
            logger.info('hello middleware');
            return next();
          }
        ]
      }
    ];
    const blacklist: string[] = [];
    const whitelist: string[] = [];
    return {
      blacklist,
      middlewareRecords,
      whitelist
    };
  }
}
