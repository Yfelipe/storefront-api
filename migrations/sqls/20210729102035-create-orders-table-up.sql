CREATE TABLE orders(id SERIAL PRIMARY KEY, status VARCHAR(8) NOT NULL, user_id bigint REFERENCES users(id));
