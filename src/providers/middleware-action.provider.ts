import { RequestContext } from '@loopback/rest';
import { inject, Provider, Getter } from '@loopback/context';
import { oc } from 'ts-optchain.macro';
import { runMiddleware } from 'middleware-runner';
import {
  MiddlewareChains,
  MiddlewareAction,
  MiddlewareBindings,
  MiddlewareConfig,
  MiddlewareMetadata
} from '../types';

export class MiddlewareActionProvider<Result>
  implements Provider<MiddlewareAction<Result>> {
  constructor(
    @inject.getter(MiddlewareBindings.Metadata.MIDDLEWARE)
    public getMiddlewareMetadata: Getter<MiddlewareMetadata>
  ) {}

  value(): MiddlewareAction<Result> {
    return (...params) => this.action(...params);
  }

  async action(
    context: RequestContext,
    middlewareChains: MiddlewareChains,
    config?: MiddlewareConfig
  ): Promise<Result> {
    const { request, response } = context;
    const middlewareMetadata:
      | MiddlewareMetadata
      | undefined = await this.getMiddlewareMetadata();
    let filteredMiddlewareChains = filter<MiddlewareChains>(
      middlewareChains,
      oc(config).whitelist(),
      oc(config).blacklist()
    );
    filteredMiddlewareChains = filter<MiddlewareChains>(
      filteredMiddlewareChains,
      oc(middlewareMetadata).whitelist(),
      oc(middlewareMetadata).blacklist()
    );
    return runMiddleware(
      request,
      response,
      Object.entries(filteredMiddlewareChains).map(f => f[1])
    );
  }
}

function filter<Data extends { [key: string]: any }>(
  data: Data,
  whitelist?: string[],
  blacklist?: string[]
): Data {
  let filteredData = {} as Data;
  if (blacklist) filteredData = { ...data };
  (blacklist || []).forEach((blacklistItem: string) => {
    delete filteredData[blacklistItem];
  });
  (whitelist || []).forEach((whitelistItem: string) => {
    if (data[whitelistItem]) {
      // @ts-ignore
      filteredData[whitelistItem] = data[whitelistItem];
    }
  });
  return filteredData;
}
