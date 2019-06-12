import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import { MiddlewareChain, NextFunction } from 'middleware-runner';
import { RequestContext } from '@loopback/rest';

export interface MiddlewareConfig {
  blacklist?: string[] | null;
  middlewareRecords?: MiddlewareRecord[];
  whitelist?: string[] | null;
}

export interface MiddlewareDecoratorConfig {
  blacklist?: string[] | boolean;
  whitelist?: string[] | boolean;
}

export interface MiddlewareRecord {
  keys: string[];
  chain: MiddlewareChain;
}

export type MiddlewareAction<Result = any> = (
  context: RequestContext
) => Promise<Result>;

export interface MiddlewareMetadata {
  blacklist?: string[] | null;
  middlewareChains: MiddlewareChain[];
  whitelist?: string[] | null;
}

export namespace MiddlewareBindings {
  export namespace Accessors {
    export const MIDDLEWARE_METADATA = MetadataAccessor.create<
      MiddlewareMetadata,
      MethodDecorator
    >('lb4-middleware.accessors.middleware-metadata');
  }
  export namespace Providers {
    export const MIDDLEWARE_ACTION = BindingKey.create<MiddlewareAction>(
      'lb4-middleware.providers.middleware-action'
    );
    export const MIDDLEWARE_CONFIG = BindingKey.create<MiddlewareConfig>(
      'lb4-middleware.providers.middleware-config'
    );
    export const MIDDLEWARE_METADATA = BindingKey.create<
      MiddlewareMetadata | undefined
    >('lb4-middleware.providers.middleware-metadata');
  }
}

export { MiddlewareChain, NextFunction };
