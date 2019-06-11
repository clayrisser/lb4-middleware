import { MiddlewareChain } from 'middleware-runner';
import { oc } from 'ts-optchain';
import {
  MetadataInspector,
  Constructor,
  MethodDecoratorFactory
} from '@loopback/context';
import {
  MiddlewareBindings,
  MiddlewareDecoratorConfig,
  MiddlewareMetadata
} from '../types';

export function middleware(
  ...params: (string | MiddlewareChain | MiddlewareDecoratorConfig)[]
) {
  const middlewareChains: MiddlewareChain[] = [];
  const recordKeys: string[] = [];
  const lastParam = params[params.length - 1];
  let config: MiddlewareDecoratorConfig = {};
  if (typeof lastParam === 'object' && !Array.isArray(lastParam)) {
    config = params.pop() as MiddlewareDecoratorConfig;
  }
  params.forEach(param => {
    if (typeof param === 'string') {
      recordKeys.push(param);
    } else if (typeof param === 'function' || Array.isArray(param)) {
      middlewareChains.push(param);
    } else {
      throw new Error("only last param can be 'MiddlewareDecoratorConfig'");
    }
  });
  let blacklist = null;
  let whitelist = null;
  if (oc(config).whitelist() === true && oc(config).blacklist() === true) {
    throw new Error("whitelist and blacklist cannot both be 'true'");
  }
  if (oc(config).blacklist() === true) {
    blacklist = recordKeys;
    whitelist = Array.isArray(oc(config).whitelist())
      ? (oc(config).whitelist() as string[])
      : null;
  } else {
    blacklist = Array.isArray(oc(config).blacklist())
      ? (oc(config).blacklist() as string[])
      : null;
    whitelist = [
      ...recordKeys,
      ...(Array.isArray(oc(config).whitelist())
        ? (oc(config).whitelist() as string[])
        : [])
    ];
  }
  return MethodDecoratorFactory.createDecorator<MiddlewareMetadata>(
    MiddlewareBindings.Accessors.MIDDLEWARE_METADATA,
    {
      blacklist,
      middlewareChains,
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
