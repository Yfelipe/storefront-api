import express, { NextFunction, Request, Response } from 'express';
import { OrderStore } from '../models/order';
import jwt from 'jsonwebtoken';

const store = new OrderStore();

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

const create = async (req: Request, res: Response) => {
  const userId = req.body.decodedToken.user.id;

  const products = await store.create(userId, req.body.products);
  res.json(products);
};

const userOrder = async (req: Request, res: Response) => {
  const userId = req.body.decodedToken.user.id;

  const products = await store.userOrder(
    userId,
    req.params.id as unknown as number
  );
  res.json(products);
};

const userCompletedOrders = async (req: Request, res: Response) => {
  const userId = req.body.decodedToken.user.id;

  const products = await store.userCompletedOrders(userId);

  res.json(products);
};

const order_routes = (app: express.Application) => {
  app.put('/order', verifyToken, create);
  app.get('/order/:id', verifyToken, userOrder);
  app.get('/completed-orders', verifyToken, userCompletedOrders);
};

export default order_routes;
