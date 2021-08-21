import { OrderProducts, OrderStore } from '../order';

const store = new OrderStore();

const newTestOrder: OrderProducts = {
  id: 2,
  quantity: 1
};

describe('Order model tests: ', () => {
  describe('Verify order methods: ', () => {
    it('Should have a create method', () => {
      expect(store.create).toBeDefined();
    });

    it('Should have an user order method', () => {
      expect(store.userOrder).toBeDefined();
    });

    it('Should have a user completed orders method', () => {
      expect(store.userCompletedOrders).toBeDefined();
    });
  });

  describe('Test order methods: ', () => {
    it('Should create an order and return it', async () => {
      const order = await store.create(1, [newTestOrder]);

      expect(order).toBeGreaterThan(0);
    });

    it('Should return user order by id', async () => {
      const userOrder = await store.userOrder('1', 2);

      expect(userOrder).toEqual([
        {
          order_id: 2,
          status: 'active',
          product_name: 'Monster Energy Drink',
          price: 3,
          quantity: 1
        }
      ]);
    });

    it('Should return empty as there is no completed orders for user', async () => {
      const order = await store.userCompletedOrders(1);

      expect(order).toEqual([]);
    });
  });
});
