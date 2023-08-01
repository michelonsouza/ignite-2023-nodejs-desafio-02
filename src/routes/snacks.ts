import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '@/database';
import { checkSessionIdExists } from '@/middlewares';

export async function snacksRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async request => {
      const getSnacksHeadersSchema = z.object({
        'user-id': z.string().uuid(),
      });

      const { 'user-id': userId } = getSnacksHeadersSchema.parse(
        request.headers,
      );

      const snacks = (await knex('snacks').where('user_id', userId)).map(
        snack => ({
          ...snack,
          is_on_the_diet: !!snack?.is_on_the_diet,
        }),
      );

      return {
        snacks,
      };
    },
  );

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getSnacksHeadersSchema = z.object({
        'user-id': z.string().uuid(),
      });

      const { 'user-id': user_id } = getSnacksHeadersSchema.parse(
        request.headers,
      );

      const createSnackBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_on_the_diet: z.boolean(),
        created_at: z.string().nullable(),
      });

      const { name, description, is_on_the_diet, created_at } =
        createSnackBodySchema.parse(request.body);

      await knex('snacks').insert({
        id: randomUUID(),
        name,
        user_id,
        created_at,
        description,
        is_on_the_diet,
        updated_at: created_at,
      });

      return reply.status(201).send();
    },
  );

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(request.params);
      const getSnacksHeadersSchema = z.object({
        'user-id': z.string().uuid(),
      });

      const { 'user-id': user_id } = getSnacksHeadersSchema.parse(
        request.headers,
      );

      await knex('snacks').delete().where({
        id,
        user_id,
      });

      return reply.status(204).send();
    },
  );

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(request.params);
      const getSnacksHeadersSchema = z.object({
        'user-id': z.string().uuid(),
      });

      const { 'user-id': user_id } = getSnacksHeadersSchema.parse(
        request.headers,
      );

      const createSnackBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_on_the_diet: z.boolean(),
      });

      const { name, description, is_on_the_diet } = createSnackBodySchema.parse(
        request.body,
      );

      await knex('snacks')
        .update({
          name,
          description,
          is_on_the_diet,
        })
        .where({
          id,
          user_id,
        });

      return reply.status(201).send();
    },
  );
}
