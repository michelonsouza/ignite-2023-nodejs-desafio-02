import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { env } from './env';
// import { transactionsRoutes } from './routes';

const logger = !!JSON.parse(env.LOGGER);

export const app = fastify({
  logger,
});

app.register(cookie);

// app.register(transactionsRoutes, {
//   prefix: 'transactions',
// });
