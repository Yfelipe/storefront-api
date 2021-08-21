import express, { NextFunction, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import jwt from 'jsonwebtoken';

const store = new ProductStore();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET as string);

    next();
  } catch (err) {
    res.status(401).json('Invalid token');
  }
};

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  const newProduct: Product = {
    name: req.body.name,
    price: req.body.price,
    categories: req.body.categories
  };

  const createdProduct = await store.create(newProduct);
  res.json(createdProduct);
};

const topProducts = async (_req: Request, res: Response) => {
  const products = await store.topProducts();
  res.json(products);
};

const productsByCategory = async (req: Request, res: Response) => {
  const category = req.params.category;

  const products = await store.productsByCategory(category);
  res.json(products);
};

const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/product/:id', show);
  app.put('/product', verifyToken, create);
  app.get('/top-products', topProducts);
  app.get('/products/category/:category', productsByCategory);
};

export default product_routes;
