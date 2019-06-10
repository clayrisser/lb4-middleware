import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import { MiddlewareChain } from 'middleware-runner';
import { RequestContext } from '@loopback/rest';

export interface MiddlewareConfig {
  blacklist?: string[];
  middlewareRecords?: MiddlewareRecord[];
  whitelist?: string[];
}

export interface MiddlewareDecoratorConfig {
  blacklist?: string[] | boolean;
  whitelist?: string[] | boolean;
}

export interface MiddlewareRecord {
  keys: string[];
  chain: MiddlewareChain;
}

export type MiddlewareAction<Result> = (
  context: RequestContext
) => Promise<Result>;

export interface MiddlewareMetadata {
  blacklist: string[];
  middlewareChains: MiddlewareChain[];
  whitelist: string[];
}

export const MiddlewareBindings = {
  Accessors: {
    MIDDLEWARE_METADATA: MetadataAccessor.create<
      MiddlewareMetadata,
      MethodDecorator
    >('lb4-middleware.accessors.middleware-metadata')
  },
  Metadata: {
    MIDDLEWARE: BindingKey.create<MiddlewareMetadata | undefined>(
      'lb4-middleware.metadata.middleware'
    )
  },
  Config: {
    MIDDLEWARE: BindingKey.create<MiddlewareConfig>(
      'lb4-middleware.config.middleware'
    )
  }
};
