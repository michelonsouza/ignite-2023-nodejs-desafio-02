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

describe('[USERS] routes', async () => {
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

  it('should be able create a new user', async () => {
    const userData = {
      name: faker.person.fullName(),
      avatar_url: faker.internet.avatar(),
    };

    const response = await supertest(app.server).post('/users').send(userData);

    expect(response.statusCode).toEqual(201);
  });

  it('should be able list users (only the user)', async () => {
    const userData = {
      name: faker.person.fullName(),
      avatar_url: faker.internet.avatar(),
    };

    const createUserResponse = await supertest(app.server)
      .post('/users')
      .send(userData);

    const cookies = createUserResponse.get('Set-Cookie');

    const response = await supertest(app.server)
      .get('/users')
      .set('Cookie', cookies);

    expect(response.statusCode).toEqual(200);
    expect(response?.body?.users).toEqual([
      expect.objectContaining({
        name: userData.name,
        avatar_url: userData.avatar_url,
      }),
    ]);
  });

  it('should be able revalidate session_id cookie', async () => {
    const userData = {
      name: faker.person.fullName(),
      avatar_url: faker.internet.avatar(),
    };

    const createUserResponse = await supertest(app.server)
      .post('/users')
      .send(userData);

    const oldCookies = createUserResponse.get('Set-Cookie');

    const revalidateResponse = await supertest(app.server)
      .get('/users/session-revalidate')
      .set('Cookie', oldCookies);

    const newCookies = revalidateResponse.get('Set-Cookie');

    expect(revalidateResponse.statusCode).toEqual(204);
    expect(oldCookies).not.toEqual(newCookies);
  });

  it('should not be able list users when not set session_id cookie', async () => {
    const getusersResponse = await supertest(app.server).get('/users');

    expect(getusersResponse.statusCode).toEqual(401);
  });

  it('should not be able list users when not set correct session_id cookie', async () => {
    const userData = {
      name: faker.person.fullName(),
      avatar_url: faker.internet.avatar(),
    };

    const createUserResponse = await supertest(app.server)
      .post('/users')
      .send(userData);

    const cookies = createUserResponse.get('Set-Cookie');
    const [startCookie, ...rest] = cookies[0].split('; ');
    const newStartCookie = `${startCookie.substring(0, 44)}${faker.number.int({
      min: 10,
      max: 99,
    })}`;
    const newCookie = [[newStartCookie, ...rest].join('; ')];

    const getusersResponse = await supertest(app.server)
      .get('/users')
      .set('Cookie', newCookie);

    expect(getusersResponse.statusCode).toEqual(401);
  });
});
