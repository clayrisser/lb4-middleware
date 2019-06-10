import {
  MetadataInspector,
  Constructor,
  MethodDecoratorFactory
} from '@loopback/context';
import { MiddlewareMetadata, MiddlewareBindings } from '../types';

export function middleware(...whitelist: string[]) {
  return MethodDecoratorFactory.createDecorator<MiddlewareMetadata>(
    MiddlewareBindings.Accessors.MIDDLEWARE_METADATA,
    {
      blacklist: [],
      whitelist
    }
  );
}

export function getMiddlewareMetadata(
  controllerClass: Constructor<{}>,
  methodName: string
): MiddlewareMetadata | undefined {
  return MetadataInspector.getMethodMetadata<MiddlewareMetadata>(
    MiddlewareBindings.Accessors.MIDDLEWARE_METADATA,
    controllerClass.prototype,
    methodName
  );
}
