import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', table => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id').deferrable('deferred');
    table.text('name').notNullable();
    table.text('description').notNullable();
    table.date('date').notNullable();
    table.time('time').notNullable();
    table.boolean('is_on_the_diet').notNullable().defaultTo(true);
    table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks');
}
