import { Provider } from '@loopback/context';
import { MiddlewareConfig, MiddlewareRecord } from '../types';

export class MiddlewareConfigProvider implements Provider<MiddlewareConfig> {
  constructor() {}

  value(): MiddlewareConfig {
    return {
      blacklist: [] as string[],
      middlewareRecords: [] as MiddlewareRecord[],
      whitelist: [] as string[]
    };
  }
}
