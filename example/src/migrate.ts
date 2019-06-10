import { Lb4MiddlewareApplication } from './application';

const logger = console;

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  logger.log('Migrating schemas (%s existing schema)', existingSchema);
  const app = new Lb4MiddlewareApplication();
  await app.boot();
  await app.migrateSchema({ existingSchema });
  process.exit(0);
}

migrate(process.argv).catch(err => {
  logger.error('Cannot migrate database schema', err);
  process.exit(1);
});
