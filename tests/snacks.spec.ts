import { execSync } from 'node:child_process';
import {
  expect,
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import supertest from 'supertest';
import { fakerPT_BR as faker } from '@faker-js/faker';

import { app } from '../src/app';

function snackFactory({
  is_on_the_diet = true,
  refDate,
}: {
  is_on_the_diet?: boolean;
  refDate?: Date | string;
} = {}) {
  return {
    name: faker.word.words(4),
    description: faker.lorem.text(),
    date: faker.date.future({ refDate }).toISOString().split('T')[0],
    time: faker.date.anytime().toISOString().split('T')[1].split('.')[0],
    is_on_the_diet,
  };
}

async function stubUser(): Promise<string[]> {
  const userData = {
    name: faker.person.fullName(),
    avatar_url: faker.internet.avatar(),
  };

  const createUserResponse = await supertest(app.server)
    .post('/users')
    .send(userData);

  const cookies = createUserResponse.get('Set-Cookie');

  return cookies;
}

async function stubSnacks() {
  const cookies = await stubUser();

  const snackData = snackFactory();

  await supertest(app.server)
    .post('/snacks')
    .set('Cookie', cookies)
    .send(snackData);

  const getSnackListresponse = await supertest(app.server)
    .get('/snacks')
    .set('Cookie', cookies);

  return { cookies, snackData, getSnackListresponse };
}

describe('🍔 [SNACKS] routes', async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:latest');
  });

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all');
  });

  it('should be able to create a new snack', async () => {
    const cookies = await stubUser();

    const snackData = {
      name: faker.word.words(4),
      description: faker.lorem.text(),
      date: faker.date.anytime().toISOString().split('T')[0],
      time: faker.date.anytime().toISOString().split('T')[1].split('.')[0],
      is_on_the_diet: true,
    };

    const snackResponse = await supertest(app.server)
      .post('/snacks')
      .set('Cookie', cookies)
      .send(snackData);

    expect(snackResponse.statusCode).toEqual(201);
  });

  it('should be able to list user stacks', async () => {
    const { getSnackListresponse, snackData } = await stubSnacks();

    expect(getSnackListresponse.statusCode).toEqual(200);
    expect(getSnackListresponse?.body?.snacks).toEqual([
      expect.objectContaining(snackData),
    ]);
  });

  it('should be able to get a unique user snack by ID', async () => {
    const { getSnackListresponse, snackData, cookies } = await stubSnacks();

    const [snack] = getSnackListresponse.body.snacks;

    const getSnackResponse = await supertest(app.server)
      .get(`/snacks/${snack.id}`)
      .set('Cookie', cookies);

    expect(getSnackResponse.statusCode).toEqual(200);
    expect(getSnackResponse?.body?.snack).toEqual(
      expect.objectContaining(snackData),
    );
  });

  it('should be able to update a user snack by ID', async () => {
    const { getSnackListresponse, snackData, cookies } = await stubSnacks();

    const updateSnackData = snackFactory({ is_on_the_diet: false });

    const [snack] = getSnackListresponse.body.snacks;

    await supertest(app.server)
      .put(`/snacks/${snack.id}`)
      .send(updateSnackData)
      .set('Cookie', cookies);

    const getSnackResponse = await supertest(app.server)
      .get(`/snacks/${snack.id}`)
      .set('Cookie', cookies);

    expect(getSnackResponse.statusCode).toEqual(200);
    expect(getSnackResponse?.body?.snack).not.toEqual(
      expect.objectContaining(snackData),
    );
  });

  it('should be able to delete a user snack by ID', async () => {
    const { getSnackListresponse, cookies } = await stubSnacks();

    const [snack] = getSnackListresponse.body.snacks;

    const deleteSnackResponse = await supertest(app.server)
      .delete(`/snacks/${snack.id}`)
      .set('Cookie', cookies);

    const getSnackResponse = await supertest(app.server)
      .get('/snacks')
      .set('Cookie', cookies);

    expect(deleteSnackResponse.statusCode).toEqual(204);
    expect(getSnackResponse?.body?.snacks).toEqual([]);
  });

  it('should be able to get summary from user', async () => {
    const { cookies, snackData } = await stubSnacks();
    const mockSnack1 = snackFactory({ refDate: snackData.date });
    const mockSnack2 = snackFactory({ refDate: mockSnack1.date });
    const mockSnack3 = snackFactory({
      refDate: mockSnack2.date,
      is_on_the_diet: false,
    });
    const mockSnack4 = snackFactory({ refDate: mockSnack3.date });
    const mockSnack5 = snackFactory({ refDate: mockSnack4.date });
    const mockedSnacks = [
      mockSnack1,
      mockSnack2,
      mockSnack3,
      mockSnack4,
      mockSnack5,
    ];

    await Promise.all(
      mockedSnacks.map(snack =>
        supertest(app.server)
          .post('/snacks')
          .send(snack)
          .set('Cookie', cookies),
      ),
    );

    const getSummaryResponse = await supertest(app.server)
      .get('/snacks/summary')
      .set('Cookie', cookies);

    expect(getSummaryResponse.statusCode).toEqual(200);
    expect(getSummaryResponse?.body?.summary).toEqual({
      in_diet: 5,
      out_diet: 1,
      total: 6,
      best_sequence: 3,
    });
  });
});
