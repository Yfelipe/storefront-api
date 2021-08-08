import client from '../database';

export type Order = {
  id: number;
  status: string;
  user_id: number;
  products: Array<{
    product_id: string;
    quantity: number;
  }>;
};

export interface OrderProducts {
  id: number;
  quantity: number;
}

export interface UserOrder {
  order_id: number;
  status: string;
  product_name: string;
  price: number;
  quantity: number;
}

export class OrderStore {
  async create(userId: number, products: OrderProducts[]): Promise<Order[]> {
    try {
      const connection = await client.connect();
      const orderQuery =
        'INSERT INTO orders(status, user_id) VALUES($1, $2) RETURNING id';

      const order = await connection.query(orderQuery, ['active', userId]);
      const orderId = order.rows[0].id;

      products.map(async (product) => {
        const orderProductSql =
          'INSERT INTO order_products(quantity, order_id, product_id) VALUES($1, $2, $3)';

        await connection.query(orderProductSql, [
          product.quantity,
          orderId,
          product.id
        ]);
      });

      connection.release();

      return orderId;
    } catch (err) {
      throw new Error(
        `Sorry we had an issue finding the order: ${userId} for user: ${userId}, error: ${err}`
      );
    }
  }

  async userOrder(userId: string, orderId: number): Promise<UserOrder[]> {
    try {
      const connection = await client.connect();
      const query =
        'SELECT orders.id AS order_id, orders.status, products.name AS product_name, products.price, order_products.quantity FROM order_products JOIN products ON order_products.product_id = products.id JOIN orders ON order_products.order_id = orders.id WHERE order_products.order_id=($1)';

      const result = await connection.query(query, [orderId]);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Sorry we had an issue finding the order: ${orderId} for user: ${userId}, error: ${err}`
      );
    }
  }

  async userCompletedOrders(userId: number): Promise<Order[]> {
    try {
      const connection = await client.connect();
      const query =
        'SELECT * FROM orders INNER JOIN order_products ON orders.id = order_products.order_id WHERE orders.user_id=($1) AND orders.status=($2) GROUP BY orders.id, order_products.id';

      const result = await connection.query(query, [userId, 'complete']);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Sorry we had an issue finding the completed orders for user: ${userId}, error: ${err}`
      );
    }
  }
}
