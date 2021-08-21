import express, { NextFunction, Request, Response } from 'express';
import { UserCreate, UserLogin, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';

const store = new UserStore();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];

    req.body.decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    );

    next();
  } catch (err) {
    res.status(401).json('Invalid token');
  }
};

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const userId = req.body.decodedToken.user.id;

  const user = await store.show(userId);

  res.json(user);
};

const create = async (_req: Request, res: Response) => {
  const newUser: UserCreate = {
    user_name: _req.body.firstName + _req.body.lastName,
    first_name: _req.body.firstName,
    last_name: _req.body.lastName,
    password: _req.body.password
  };

  const user = await store.create(newUser);
  const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string);

  res.json(token);
};

const authenticate = async (_req: Request, res: Response) => {
  const userLogin: UserLogin = {
    userName: _req.body.userName,
    password: _req.body.password
  };

  const user = await store.authenticate(userLogin);

  if (user) {
    const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string);

    res.json(token);
    return;
  }

  res.status(401).send('Sorry your login was unsuccessful');
};

const user_routes = (app: express.Application) => {
  app.get('/users', verifyToken, index);
  app.get('/user', verifyToken, show);
  app.put('/user', create);
  app.post('/login', authenticate);
};

export default user_routes;
