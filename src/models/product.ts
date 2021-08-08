import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  categories: Array<string>;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const connection = await client.connect();
      const query = 'SELECT * FROM products';

      const result = await connection.query(query);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Sorry we had an issue with your request, error: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const connection = await client.connect();
      const query = 'SELECT * FROM products WHERE id=($1)';

      const result = await connection.query(query, [id]);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Sorry we had an issue in finding your product, error: ${err}`
      );
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const connection = await client.connect();
      const query =
        'INSERT INTO products (name, price, categories) VALUES($1, $2, $3) RETURNING *';

      const result = await connection.query(query, [
        product.name,
        product.price,
        product.categories
      ]);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Sorry we had an issue in adding the product, error: ${err}`
      );
    }
  }

  async topProducts(): Promise<Product[]> {
    try {
      const connection = await client.connect();
      const query =
        'SELECT products.name, count(order_products.product_id) AS "amount ordered" FROM products INNER JOIN order_products ON products.id = order_products.product_id GROUP BY order_products.product_id, products.id ORDER BY order_products.product_id LIMIT 5';

      const result = await connection.query(query);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Sorry we had an issue with your request, error: ${err}`);
    }
  }

  async productsByCategory(category: string): Promise<Product[]> {
    try {
      const connection = await client.connect();
      const query = 'SELECT * FROM products WHERE ($1) = ANY (categories)';

      const result = await connection.query(query, [category]);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Sorry we had an issue finding products by categories, error: ${err}`
      );
    }
  }
}
