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
    const filteredRecordKeys = getFilteredRecordKeys(
      recordKeys,
      this.middlewareConfig,
      middlewareMetadata
    );
    const filteredMiddlewareRecords: MiddlewareRecord[] = getFilteredRecords(
      oc(this.middlewareConfig).middlewareRecords([]),
      filteredRecordKeys
    );
    return runMiddleware(request, response, [
      ...filteredMiddlewareRecords.map(record => record.chain).flat(),
      ...oc(middlewareMetadata).middlewareChains([])
    ]);
  }
}

function getFilteredRecordKeys(
  recordKeys: Set<string>,
  config: MiddlewareConfig,
  metadata: MiddlewareMetadata
): Set<string> {
  return new Set([
    ...filterRecords(
      filterRecords(recordKeys, oc(config).blacklist(), oc(config).whitelist()),
      oc(metadata).blacklist([])
    ),
    ...filterRecords(recordKeys, null, oc(metadata).whitelist([]))
  ]);
}

function getFilteredRecords(
  records: MiddlewareRecord[],
  recordKeys: Set<string>
): MiddlewareRecord[] {
  return records.reduce(
    (records: MiddlewareRecord[], record: MiddlewareRecord) => {
      for (let i = 0; i < record.keys.length; i++) {
        const key = record.keys[i];
        if (recordKeys.has(key)) {
          records.push(record);
          return records;
        }
      }
      return records;
    },
    []
  );
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
