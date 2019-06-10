import { Component, ProviderMap } from '@loopback/core';
import { MiddlewareBindings } from './types';
import {
  MiddlewareActionProvider,
  MiddlewareConfigProvider,
  MiddlewareMetadataProvider
} from './providers';

export class MiddlewareComponent implements Component {
  providers?: ProviderMap;

  constructor() {
    this.providers = {
      [MiddlewareBindings.Providers.MIDDLEWARE_ACTION
        .key]: MiddlewareActionProvider,
      [MiddlewareBindings.Providers.MIDDLEWARE_CONFIG
        .key]: MiddlewareConfigProvider,
      [MiddlewareBindings.Providers.MIDDLEWARE_METADATA
        .key]: MiddlewareMetadataProvider
    };
  }
}
