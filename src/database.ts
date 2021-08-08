import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV
} = process.env;

let client: Pool = new Pool();

switch (ENV) {
  case 'dev':
    client = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD
    });
    break;
  case 'test':
    client = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_TEST_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD
    });
    break;
}

export default client;
