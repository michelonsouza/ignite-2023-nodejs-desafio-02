/* eslint-disable no-restricted-syntax */
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

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async request => {
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

      const snack = await knex('snacks')
        .select()
        .where({
          id,
          user_id,
        })
        .first();

      return {
        snack: { ...snack, is_on_the_diet: !!snack?.is_on_the_diet },
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
        date: z.string(),
        time: z.string(),
        description: z.string(),
        is_on_the_diet: z.boolean(),
      });

      const { name, description, date, time, is_on_the_diet } =
        createSnackBodySchema.parse(request.body);

      await knex('snacks').insert({
        id: randomUUID(),
        name,
        date,
        time,
        user_id,
        description,
        is_on_the_diet,
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
        name: z.string().optional(),
        date: z.string().optional(),
        time: z.string().optional(),
        description: z.string().optional(),
        is_on_the_diet: z.boolean().optional(),
      });

      const { name, description, date, time, is_on_the_diet } =
        createSnackBodySchema.parse(request.body);

      await knex('snacks')
        .update({
          name,
          date,
          time,
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

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async request => {
      const getSnacksHeadersSchema = z.object({
        'user-id': z.string().uuid(),
      });

      const { 'user-id': user_id } = getSnacksHeadersSchema.parse(
        request.headers,
      );

      const getSnacksResult = await knex('snacks')
        .select('*')
        .orderBy('date', 'desc')
        .where({ user_id });

      let oldBestSequence = 0;
      let bestSequence = 0;

      const summary = getSnacksResult.reduce(
        (accumulator: Record<string, number>, snack) => {
          // eslint-disable-next-line no-extra-boolean-cast
          if (!!snack.is_on_the_diet) {
            accumulator.in_diet += 1;
            bestSequence += 1;

            if (bestSequence > oldBestSequence) {
              oldBestSequence += 1;
            }
          }

          if (!snack.is_on_the_diet) {
            accumulator.out_diet += 1;
            bestSequence = 0;
          }

          return accumulator;
        },
        {
          in_diet: 0,
          out_diet: 0,
          total: getSnacksResult.length,
          best_sequence: 0,
        },
      );

      /* c8 ignore next 3 */
      bestSequence =
        bestSequence > oldBestSequence ? bestSequence : oldBestSequence;

      summary.best_sequence = bestSequence;

      return { summary };
    },
  );
}
