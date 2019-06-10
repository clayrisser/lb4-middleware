import { ApplicationConfig } from '@loopback/core';

const { env } = process;

export default {
  rest: {
    port: +(env.PORT || 3000),
    host: env.HOST || '0.0.0.0',
    openApiSpec: {
      setServersFromRequest: true
    }
  }
} as ApplicationConfig;
