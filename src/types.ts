import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import { Middlewares } from 'middleware-runner';
import { RequestContext } from '@loopback/rest';

export interface MiddlewareOptions {}

export type MiddlewareAction<Result> = (
  context: RequestContext,
  middlewares: Middlewares
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
