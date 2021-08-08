# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index
  - Get all products
    - GET /products
- Show
  - Get product by ID
    - GET /product/{id}
- Create [token required]
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
- [OPTIONAL] Top 5 most popular products
  - Get top 5 sold products
    - GET /top-products
- [OPTIONAL] Products by category (args: category)
  - Get products by category
      - GET /products/category/{category}

#### Users
- Index [token required]
  - Get all users
    - GET /users (Requires auth token)
- Show [token required]
  - Get user by ID in token
    - GET /users (Requires auth token)
- Create New
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

#### Orders
- Current Order by user (args: user id)[token required]
  - Get order by ID and user id in token
    - GET /order/{id} (Requires auth token)
- [OPTIONAL] Completed Orders by user (args: user id)[token required]
  - Get user completed orders
    - GET /completed-orders (Requires auth token)

## Data Shapes
#### Product
-  id (number)
- name (string)
- price (number)
- [OPTIONAL] categories (array of string)

#### User
- id (number)
- first_name (string)
- last_name (string)
- password (string)

#### Orders
- id (number)
- user_id (number)
- status of order (active or complete)
- Uses a relational table order_products with:
  - product_id (number)
  - quantity in the order (number)

