import Client from '../database';

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    password: string,
}

export class UserStore {

    async index(): Promise<User[]> {
        try {
            const connection = await Client.connect()
            const query = 'SELECT * FROM users'

            const result = await connection.query(query)
            connection.release()

            return result.rows
        } catch (err) {
            throw new Error(`Sorry we had an issue with your request, error: ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const connection = await Client.connect()
            const query = 'SELECT * FROM users WHERE id=($1)'

            const result = await connection.query(query, [id])
            connection.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Sorry we had an issue in finding the user, error: ${err}`)
        }
    }

    async create(user: User): Promise<User> {
        try {
            const connection = await Client.connect()
            const query = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *'

            const result = await connection.query(query, [user.firstName, user.lastName, user.password])
            connection.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Sorry we had an issue adding the user, error: ${err}`)
        }
    }
}
