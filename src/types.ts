import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import { MiddlewareChain } from 'middleware-runner';
import { RequestContext } from '@loopback/rest';

export interface MiddlewareConfig {
  blacklist?: string[];
  whitelist?: string[];
}

export interface MiddlewareChains {
  [key: string]: MiddlewareChain;
}

export type MiddlewareAction<Result> = (
  context: RequestContext,
  middlewareChains: MiddlewareChains,
  config?: MiddlewareConfig
) => Promise<Result>;

export interface MiddlewareMetadata {
  blacklist: string[];
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
  }
};
