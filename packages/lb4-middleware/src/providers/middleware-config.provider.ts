import { Provider } from '@loopback/context';
import { MiddlewareConfig, MiddlewareRecord } from '../types';

export class MiddlewareConfigProvider implements Provider<MiddlewareConfig> {
  constructor() {}

  value(): MiddlewareConfig {
    const middlewareRecords: MiddlewareRecord[] = [
      {
        keys: [],
        chain: []
      }
    ];
    const blacklist: string[] | null = null;
    const whitelist: string[] | null = null;
    return {
      blacklist,
      middlewareRecords,
      whitelist
    };
  }
}
