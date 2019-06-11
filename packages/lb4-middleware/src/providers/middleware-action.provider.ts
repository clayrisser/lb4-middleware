import { RequestContext } from '@loopback/rest';
import { inject, Provider, Getter } from '@loopback/context';
import { oc } from 'ts-optchain';
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
    @inject(MiddlewareBindings.Providers.MIDDLEWARE_CONFIG)
    public middlewareConfig: MiddlewareConfig,
    @inject.getter(MiddlewareBindings.Providers.MIDDLEWARE_METADATA)
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
    const recordKeys = new Set(
      oc(this.middlewareConfig)
        .middlewareRecords([])
        .map(record => record.keys)
        .flat()
    );
    let filteredRecordKeys = filterRecords(
      recordKeys,
      oc(this.middlewareConfig).blacklist(),
      oc(this.middlewareConfig).whitelist()
    );
    filteredRecordKeys = filterRecords(
      filteredRecordKeys,
      oc(middlewareMetadata).blacklist([])
    );
    filteredRecordKeys = new Set([
      ...filteredRecordKeys,
      ...filterRecords(recordKeys, null, oc(middlewareMetadata).whitelist([]))
    ]);
    const filteredMiddlewareRecords: MiddlewareRecord[] = oc(
      this.middlewareConfig
    )
      .middlewareRecords([])
      .reduce(
        (filteredRecords: MiddlewareRecord[], record: MiddlewareRecord) => {
          for (let i = 0; i < record.keys.length; i++) {
            const key = record.keys[i];
            if (filteredRecordKeys.has(key)) {
              filteredRecords.push(record);
              return filteredRecords;
            }
          }
          return filteredRecords;
        },
        []
      );
    return runMiddleware(request, response, [
      ...filteredMiddlewareRecords.map(record => record.chain).flat(),
      ...oc(middlewareMetadata).middlewareChains([])
    ]);
  }
}

function filterRecords(
  recordKeys: Set<string>,
  blacklist?: string[] | null,
  whitelist?: string[] | null
): Set<string> {
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
  return recordKeys;
}
