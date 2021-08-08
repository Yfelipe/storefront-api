import { Product, ProductStore } from '../product';

const store = new ProductStore();

const newProduct: Product = {
  name: 'Monster Energy Drink',
  price: 3,
  categories: ['energy drink']
};

const expectedProduct = {
  id: 1,
  name: 'Monster Energy Drink',
  price: 3,
  categories: ['energy drink']
};

describe('Product model tests: ', () => {
  describe('Verify product methods', () => {
    it('Should have an index method', () => {
      expect(store.index).toBeDefined();
    });

    it('Should have a show method', () => {
      expect(store.show).toBeDefined();
    });

    it('Should have a create method', () => {
      expect(store.create).toBeDefined();
    });

    it('Should have a top products method', () => {
      expect(store.topProducts).toBeDefined();
    });

    it('Should have a products by category method', () => {
      expect(store.productsByCategory).toBeDefined();
    });
  });

  describe('Test products methods: ', () => {
    it('Should create a product and return it', async () => {
      const product = await store.create(newProduct);

      expect(product).toEqual(expectedProduct);
    });

    it('Should return an array of products containing the new product', async () => {
      const productArray = await store.index();
      expect(productArray).toEqual([expectedProduct]);
    });

    it('Should return the product of id 1', async () => {
      const product = await store.show('1');
      expect(product).toEqual(expectedProduct);
    });

    it('Should return empty array for top products as there is no orders', async () => {
      const products = await store.topProducts();
      expect(products).toEqual([]);
    });

    it('Should return array with expected product', async () => {
      const products = await store.productsByCategory('energy drink');
      expect(products).toEqual([expectedProduct]);
    });

    it('Should return an empty array as there is no product in the soda category', async () => {
      const products = await store.productsByCategory('soda');
      expect(products).toEqual([]);
    });
  });
});
