import express from 'express';
import bodyParser from 'body-parser';
import product_routes from './handlers/product';
import user_routes from './handlers/user';
import order_routes from './handlers/order';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());

product_routes(app);
user_routes(app);
order_routes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
