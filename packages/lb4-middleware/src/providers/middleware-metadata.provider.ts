import { Constructor, inject, Provider } from '@loopback/context';
import { CoreBindings } from '@loopback/core';
import { MiddlewareMetadata } from '../types';
import { getMiddlewareMetadata } from '../decorators';

export class MiddlewareMetadataProvider
  implements Provider<MiddlewareMetadata | undefined> {
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, { optional: true })
    private readonly controllerClass?: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, { optional: true })
    private readonly methodName?: string
  ) {}

  value(): MiddlewareMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return undefined;
    return getMiddlewareMetadata(this.controllerClass, this.methodName);
  }
}
