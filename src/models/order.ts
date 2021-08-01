import Client from '../database';

export type Order = {
    id: number,
    status: string,
    userId: string,
    products: Array<{
        productId: string,
        quantity: number
    }>
}

export class OrderStore {

    async userOrder(userId: string, orderId: number): Promise<Order[]> {
        try {
            const connection = await Client.connect()
            const query = 'SELECT * FROM orders INNER JOIN order_products ON orders.id = order_products.order_id WHERE orders.user_id=($1) AND orders.id=($2)'

            const result = await connection.query(query, [userId, orderId])
            connection.release()

            return result.rows
        } catch (err) {
            throw new Error(`Sorry we had an issue finding the order: ${orderId} for user: ${userId}, error: ${err}`)
        }
    }

    async userCompletedOrders(userId: string): Promise<Order[]> {
        try {
            const connection = await Client.connect()
            const query = 'SELECT * FROM orders INNER JOIN order_products ON orders.id = order_products.order_id WHERE orders.user_id=($1) AND orders.status=completed'

            const result = await connection.query(query, [userId])
            connection.release()

            return result.rows
        } catch (err) {
            throw new Error(`Sorry we had an issue finding the completed orders for user: ${userId}, error: ${err}`)
        }
    }
}
