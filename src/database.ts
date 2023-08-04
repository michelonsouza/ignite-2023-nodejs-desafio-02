import { knex as Knex, Knex as KnexInstance } from 'knex';

import { env } from './env';

export const config: KnexInstance.Config = {
  client: env.DATABASE_CLIENT,
  /* c8 ignore next 6 */
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const knex = Knex(config);
