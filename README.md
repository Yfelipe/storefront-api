# Storefront Backend

This is a simple backend application with Typescript, Postgres, Docker and NodeJs to create users, products and orders.

## Requirements: 

* npm
* node 10.20
* docker-compose

### Prepare environment
An example env file is provided, so it only needs to be copied with copy & paste and renamed to .env or with the command below:
```
(unix/linux) cp .env.example .env
(windows) copy .env.example .env
```

## Starting project:

### Start postgres in docker
```
docker-compose up --build -d
```
* Because we use docker-compose the DB will be created automatically and exposed on port 5432 and only needs the migrations to be ran which is done after npm install below.
* The DB name and credentials are set in the env file.  

### Install the project dependencies
```bash
npm install
```

### Run migrations to create db
```
npm run migrate
```

###[optional] Access postgres
```bash
docker-compose exec postgres bash
su postgres
psql storefront -U frontend
```

### Running tests
This project uses Jasmine tests, to run the tests run:
```bash
npm run test
```

### Running the project
After the npm dependencies are installed and postgres has been started in docker:
```bash
npm run start
```

## Usage

### Available API's
* Note the JWT token has to be set in the Auth header for request that require authentication, the token will be returned when a user is created. 

#### User API's:
- Create a user
    - PUT /user 
    - Example Body:
      ```
      {
        "first_name":"Sheldon",
        "last_name":"Cooper",
        "password":"bazinga"
      }
      ```
    
- Get all users
    - GET /users (Requires auth token)
- Get user by ID in token
    - GET /users (Requires auth token)

#### Product API's:
- Create a product
    - PUT /product (Requires auth token)
    - Example Body: 
      ```
      {
        name: 'Monster Energy Drink',
        price: 3,
        categories: ['energy drink']
      }
      ```

- Get all products
    - GET /products
- Get product by ID
    - GET /product/{id}
- Get top 5 sold products
    - GET /top-products
- Get products by category
    - GET /products/category/{category}

#### Order API's:
- Create an order
    - PUT /order (Requires auth token) 
    - Example Body:
      ```
      [
        {product_id: 1,quantity: 3},
        {product_id: 2, quantity: 1}
      ]
      ```

- Get order by ID
    - GET /order/{id} (Requires auth token)
- Get user completed orders
    - GET /completed-orders (Requires auth token)
