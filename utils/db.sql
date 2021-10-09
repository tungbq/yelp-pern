
-- \? for help
-- \l list DB
-- \d Show tables


CREATE TABLE products (
  id INT,
  name VARCHAR(50),
  price INT,
  on_sale boolean
);

ALTER TABLE products ADD COLUMN featured boolean;

ALTER TABLE products DROP COLUMN featured;

DROP TABLE products;

CREATE TABLE restaurants (
  id INT,
  name VARCHAR(50),
  location VARCHAR(50),
  price_range INT
);

INSERT INTO restaurants (id, name, location, price_range) VALUES (123, 'test', 'binh chanh', 3);

select * from restaurants;

select name,price_range from restaurants;

-- v2
CREATE TABLE restaurants (
  id BIGSERIAL NOT NULL,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(50) NOT NULL,
  price_range INT NOT NULL
);

CREATE TABLE restaurants (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(50) NOT NULL,
  price_range INT NOT NULL check(price_range >=1 and price_range <=5)
);


CREATE TABLE reviews (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  restaurants_id BIGSERIAL NOT NULL REFERENCES restaurants(id),
  name VARCHAR(50) NOT NULL,
  review TEXT NOT NULL,
  rating INT NOT NULL check(rating >=1 and rating <=5)
);

-- yelp=# 
INSERT INTO reviews (restaurants_id, name, review, rating) VALUES (1111, 'leo', 'Bad restaurant', 1);
-- ERROR:  insert or update on table "reviews" violates foreign key constraint "reviews_restaurants_id_fkey"
-- DETAIL:  Key (restaurants_id)=(1111) is not present in table "restaurants".

