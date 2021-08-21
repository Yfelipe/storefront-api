import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

let token: string = '';

describe('Order routes test: ', () => {
  it('Should create a order and return the id', async () => {
    const tokenResponse = await request
      .post('/login')
      .send({ userName: 'AmyFowler', password: 'sheldon' });
    token = tokenResponse.body;

    const response = await request
      .put('/order')
      .send({ products: [{ id: 1, quantity: 3 }] })
      .auth(token, { type: 'bearer' });
    expect(response.body).toEqual(1);
  });

  it('Should get order by id', async () => {
    const response = await request
      .get('/order/1')
      .auth(token, { type: 'bearer' });
    expect(response.body).toEqual([
      {
        order_id: 1,
        status: 'active',
        product_name: 'Redbull Energy Drink',
        price: 5,
        quantity: 3
      }
    ]);
  });

  it('Should return empty array as there is no completed order', async () => {
    const response = await request
      .get('/completed-orders')
      .auth(token, { type: 'bearer' });
    expect(response.body).toEqual([]);
  });
});
