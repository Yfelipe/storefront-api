import client from '../database';
import bcrypt from 'bcrypt';

export interface User {
  id?: number;
  user_name: string;
  first_name: string;
  last_name: string;
  password?: string;
}

export interface UserCreate extends User {
  password: string;
}

export interface UserLogin {
  userName: string;
  password: string;
}

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS as string;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const connection = await client.connect();
      const query = 'SELECT id, user_name, first_name, last_name FROM users';

      const result = await connection.query(query);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Sorry we had an issue with your request, error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const connection = await client.connect();
      const query =
        'SELECT id, user_name, first_name, last_name FROM users WHERE id=($1)';

      const result = await connection.query(query, [id]);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Sorry we had an issue in finding the user, error: ${err}`
      );
    }
  }

  async create(user: UserCreate): Promise<User> {
    try {
      const connection = await client.connect();
      const query =
        'INSERT INTO users (user_name, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING id, user_name, first_name, last_name';

      const hash = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds)
      );

      const result = await connection.query(query, [
        user.first_name + user.last_name,
        user.first_name,
        user.last_name,
        hash
      ]);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Sorry we had an issue adding the user, error: ${err}`);
    }
  }

  async authenticate(userLogin: UserLogin): Promise<User | null> {
    try {
      const connection = await client.connect();
      const query =
        'SELECT id, user_name, first_name, last_name, password FROM users WHERE user_name=($1)';

      const result = await connection.query(query, [userLogin.userName]);
      connection.release();

      const user = result.rows[0];

      if (
        user &&
        bcrypt.compareSync(userLogin.password + pepper, user.password)
      ) {
        return user;
      }

      return null;
    } catch (err) {
      throw new Error(`Sorry we had an issue logging in, error: ${err}`);
    }
  }
}
