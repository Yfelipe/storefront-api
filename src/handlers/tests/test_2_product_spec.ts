import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

const newProduct = {
  name: 'Redbull Energy Drink',
  price: 5,
  categories: ['energy drink']
};

describe('Product routes test: ', () => {
  it('Should create a product', async () => {
    const tokenResponse = await request
      .post('/login')
      .send({ userName: 'AmyFowler', password: 'sheldon' });
    const token = tokenResponse.body;

    const response = await request
      .put('/product')
      .send(newProduct)
      .auth(token, { type: 'bearer' });
    expect(response.body).toEqual({
      id: 1,
      ...newProduct
    });
  });

  it('Should return a list of products with one product', async () => {
    const response = await request.get('/products');
    expect(response.body).toEqual([
      {
        id: 1,
        ...newProduct
      }
    ]);
  });

  it('Should return product by id', async () => {
    const response = await request.get('/product/1');
    expect(response.body).toEqual({
      id: 1,
      ...newProduct
    });
  });

  it('Should return an empty array for top products sold as there is none', async () => {
    const response = await request.get('/top-products');
    expect(response.body).toEqual([]);
  });

  it('Should return product by id', async () => {
    const response = await request.get('/products/category/energy drink');
    expect(response.body).toEqual([
      {
        id: 1,
        ...newProduct
      }
    ]);
  });
});
