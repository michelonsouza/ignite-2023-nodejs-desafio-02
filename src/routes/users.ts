import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '@/database';
import { checkSessionIdExists } from '@/middlewares';

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async request => {
      const getUsersHeadersSchema = z.object({
        'user-id': z.string().uuid(),
      });

      const { 'user-id': userId } = getUsersHeadersSchema.parse(
        request.headers,
      );

      const users = await knex('users').where({ id: userId });

      return { users };
    },
  );

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      avatar_url: z.string().nullable(),
    });

    const { name, avatar_url } = createUserBodySchema.parse(request.body);

    const session_id = randomUUID();

    reply.cookie('sessionId', session_id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    await knex('users').insert({
      id: randomUUID(),
      name,
      avatar_url,
      session_id,
    });

    return reply.status(201).send();
  });
}
