import { FastifyReply, FastifyRequest } from 'fastify';

import { knex } from '@/database';

// eslint-disable-next-line consistent-return
export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  const { sessionId: session_id } = request.cookies;

  if (!session_id) {
    return reply.status(401).send({
      error: 'Unathorized',
    });
  }

  const user = await knex('users').where('session_id', session_id).first();

  if (!user) {
    return reply.status(401).send({
      error: 'Unathorized',
    });
  }

  request.headers['user-id'] = user.id;
}
