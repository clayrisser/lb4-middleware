import { RequestContext } from '@loopback/rest';
import { inject, Provider, Getter } from '@loopback/context';
import { oc } from 'ts-optchain.macro';
import { runMiddleware } from 'middleware-runner';
import {
  MiddlewareAction,
  MiddlewareBindings,
  MiddlewareConfig,
  MiddlewareMetadata,
  MiddlewareRecord
} from '../types';

export class MiddlewareActionProvider<Result>
  implements Provider<MiddlewareAction<Result>> {
  constructor(
    @inject(MiddlewareBindings.Config.MIDDLEWARE)
    public middlewareConfig: MiddlewareConfig,
    @inject.getter(MiddlewareBindings.Metadata.MIDDLEWARE)
    public getMiddlewareMetadata: Getter<MiddlewareMetadata>
  ) {}

  value(): MiddlewareAction<Result> {
    return (...params) => this.action(...params);
  }

  async action(context: RequestContext): Promise<Result> {
    const { request, response } = context;
    const middlewareMetadata:
      | MiddlewareMetadata
      | undefined = await this.getMiddlewareMetadata();
    let filteredMiddlewareRecords = filterRecords<MiddlewareRecord>(
      oc(this.middlewareConfig).middlewareRecords([]),
      oc(this.middlewareConfig).blacklist([]),
      oc(this.middlewareConfig).whitelist([])
    );
    filteredMiddlewareRecords = filterRecords<MiddlewareRecord>(
      filteredMiddlewareRecords,
      oc(middlewareMetadata).blacklist([]),
      oc(middlewareMetadata).whitelist([])
    );
    return runMiddleware(request, response, [
      ...filteredMiddlewareRecords.map(record => record.chain).flat(),
      ...middlewareMetadata.middlewareChains
    ]);
  }
}

function filterRecords<Record extends MiddlewareRecord>(
  records: Record[],
  blacklist: string[],
  whitelist: string[]
): Record[] {
  const recordKeys = new Set(records.map(record => record.keys).flat());
  let filteredRecordKeys = new Set();
  if (blacklist) {
    filteredRecordKeys = new Set(recordKeys);
    blacklist.forEach((blacklistItem: string) => {
      filteredRecordKeys.delete(blacklistItem);
    });
  }
  (whitelist || []).forEach((whitelistItem: string) => {
    if (recordKeys.has(whitelistItem)) filteredRecordKeys.add(whitelistItem);
  });
  return records.reduce((filteredRecords: Record[], record: Record) => {
    for (let i = 0; i < record.keys.length; i++) {
      const key = record.keys[i];
      if (filteredRecordKeys.has(key)) {
        filteredRecords.push(record);
        return filteredRecords;
      }
    }
    return filteredRecords;
  }, []);
}
