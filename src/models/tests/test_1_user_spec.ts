import { UserCreate, UserStore } from '../user';

const store = new UserStore();

const newTestUser: UserCreate = {
  user_name: 'SheldonCooper',
  first_name: 'Sheldon',
  last_name: 'Cooper',
  password: 'bazinga'
};

describe('User model tests: ', () => {
  describe('Verify user methods: ', () => {
    it('Should have an index method', () => {
      expect(store.index).toBeDefined();
    });

    it('Should have a show method', () => {
      expect(store.show).toBeDefined();
    });

    it('Should have a create method', () => {
      expect(store.create).toBeDefined();
    });
  });

  describe('Test user methods: ', () => {
    it('Should create a user and return it', async () => {
      const user = await store.create(newTestUser);

      expect(user).toEqual({
        id: 1,
        user_name: 'SheldonCooper',
        first_name: 'Sheldon',
        last_name: 'Cooper'
      });
    });

    it('Should return an array of users containing the new user', async () => {
      const userArray = await store.index();
      expect(userArray).toEqual([
        {
          id: 1,
          user_name: 'SheldonCooper',
          first_name: 'Sheldon',
          last_name: 'Cooper'
        }
      ]);
    });

    it('Should return a user with id 1', async () => {
      const user = await store.show('1');
      expect(user).toEqual({
        id: 1,
        user_name: 'SheldonCooper',
        first_name: 'Sheldon',
        last_name: 'Cooper'
      });
    });
  });
});
