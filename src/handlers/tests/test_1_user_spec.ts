import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

const newTestUser = {
  firstName: 'Amy',
  lastName: 'Fowler',
  password: 'sheldon'
};

let token: string = '';

describe('User routes test: ', () => {
  it('Should create a user and return a token', async () => {
    const response = await request.put('/user').send(newTestUser);
    expect(response.status).toBe(200);

    token = response.body;
  });

  it('Should get a list of users with one user', async () => {
    const response = await request
      .get('/users')
      .auth(token, { type: 'bearer' });
    expect(response.body).toEqual([
      {
        id: 1,
        user_name: 'AmyFowler',
        first_name: 'Amy',
        last_name: 'Fowler'
      }
    ]);
  });

  it('Should return user data that made the request', async () => {
    const response = await request.get('/user').auth(token, { type: 'bearer' });
    expect(response.body).toEqual({
      id: 1,
      user_name: 'AmyFowler',
      first_name: 'Amy',
      last_name: 'Fowler'
    });
  });

  it('Should return 401 as no token is provided to auth', async () => {
    const response = await request.get('/user');
    expect(response.status).toBe(401);
  });

  it('Should return 200 on login', async () => {
    const response = await request
      .post('/login')
      .send({ userName: 'AmyFowler', password: 'sheldon' });
    expect(response.status).toBe(200);
  });
});
