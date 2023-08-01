// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  interface User {
    id: string;
    name: string;
    created_at: string;
  }

  export interface Tables {
    users: User;
  }
}
