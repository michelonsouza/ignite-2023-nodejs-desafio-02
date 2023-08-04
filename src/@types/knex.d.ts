// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  interface User {
    id: string;
    name: string;
    session_id: string;
    created_at: string;
    avatar_url?: string | null;
  }

  interface Snack {
    id: string;
    name: string;
    time: string;
    date: string;
    user_id: string;
    description: string;
    is_on_the_diet: boolean;
    created_at?: string | null;
    updated_at?: string | null;
  }

  export interface Tables {
    users: User;
    snacks: Snack;
  }
}
