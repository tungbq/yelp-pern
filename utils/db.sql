-- \? for help
-- \l list DB
-- \d Show tables
CREATE TABLE products (
  id INT,
  name VARCHAR(50),
  price INT,
  on_sale boolean
);
ALTER TABLE products
ADD COLUMN featured boolean;
ALTER TABLE products DROP COLUMN featured;
DROP TABLE products;
CREATE TABLE restaurants (
  id INT,
  name VARCHAR(50),
  location VARCHAR(50),
  price_range INT
);
INSERT INTO restaurants (id, name, location, price_range)
VALUES (123, 'test', 'binh chanh', 3);
select *
from restaurants;
select name,
  price_range
from restaurants;
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
  price_range INT NOT NULL check(
    price_range >= 1
    and price_range <= 5
  )
);
CREATE TABLE reviews (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  restaurants_id BIGSERIAL NOT NULL REFERENCES restaurants(id),
  name VARCHAR(50) NOT NULL,
  review TEXT NOT NULL,
  rating INT NOT NULL check(
    rating >= 1
    and rating <= 5
  )
);
-- 
INSERT INTO reviews (restaurants_id, name, review, rating)
VALUES (1111, 'leo', 'Bad restaurant', 1);
-- ERROR:  insert or update on table "reviews" violates foreign key constraint "reviews_restaurants_id_fkey"
-- DETAIL:  Key (restaurants_id)=(1111) is not present in table "restaurants".
select count(*)
from reviews;
SELECT MAX(rating)
FROM reviews;
SELECT AVG(rating)
FROM reviews;
SELECT trunc(AVG(rating), 2)
FROM reviews;
-- Rename column
SELECT trunc(AVG(rating), 2) AS average_reviews
FROM reviews;
SELECT trunc(AVG(rating), 2) AS avg_rating
FROM reviews
WHERE restaurants_id = 10;
SELECT location,
  COUNT(location)
FROM restaurants
GROUP BY location;
--     location    | count 
-- ----------------+-------
--  binh chanh     |     6
--  test-updated-2 |     2
SELECT restaurants_id,
  COUNT(restaurants_id)
FROM reviews
GROUP BY restaurants_id;
SELECT restaurants_id,
  AVG(rating)
FROM reviews
GROUP BY restaurants_id;
--  restaurants_id |          avg           
-- ----------------+------------------------
--              10 |     2.1250000000000000
--              13 | 1.00000000000000000000
-- (2 rows)
SELECT *
FROM restaurants
  INNER JOIN reviews ON restaurants.id = reviews.restaurants_id;
--  id |  name  |  location  | price_range | id | restaurants_id |   name    |                     review                      | rating 
-- ----+--------+------------+-------------+----+----------------+-----------+-------------------------------------------------+--------
--  10 | test-7 | binh chanh |           4 |  2 |             10 | leo       | Bad restaurants                                 |      1
--  10 | test-7 | binh chanh |           4 |  3 |             10 | reus      | Bad restaurants 1                               |      1
SELECT *
FROM restaurants
  LEFT JOIN reviews ON restaurants.id = reviews.restaurants_id;
SELECT *
FROM restaurants
  LEFT JOIN (
    SELECT restaurants_id,
      COUNT(*),
      TRUNC(AVG(rating), 1) AS avarage_rating
    FROM reviews
    GROUP BY restaurants_id
  ) reviews ON restaurants.id = reviews.restaurants_id;
--  id |     name     |    location    | price_range | restaurants_id | count | avarage_rating 
-- ----+--------------+----------------+-------------+----------------+-------+----------------
--  10 | test-7       | binh chanh     |           4 |             10 |     8 |            2.1