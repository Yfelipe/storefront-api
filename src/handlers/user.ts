import express, { NextFunction, Request, Response } from 'express';
import { UserCreate, UserStore } from '../models/user';
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
    res.json(`Invalid token ${err}`).status(401);
  }
};

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const userId = req.body.decodedToken.id;

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

const user_routes = (app: express.Application) => {
  app.get('/users', verifyToken, index);
  app.get('/user', verifyToken, show);
  app.put('/user', create);
};

export default user_routes;
