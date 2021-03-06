BEGIN;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS ownership CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  gold_pieces INTEGER DEFAULT 20,
  hashed_password VARCHAR NOT NULL
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(80) NOT NULL,
  item_quantity INTEGER DEFAULT 0,
  item_description VARCHAR(200),
  item_price INTEGER DEFAULT 20,
  item_available BOOLEAN,
  item_power INTEGER DEFAULT 0
);

CREATE TABLE ownership (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id),
  item_id INTEGER REFERENCES inventory(id)
);

INSERT INTO users (name, hashed_password)
VALUES ('Jon', 'PasswordJon'), ('Aria', 'PasswordAria'), ('Hodor', 'PasswordHodor'), ('Kevin', 'PasswordKevin');

INSERT INTO inventory
(item_name, item_quantity, item_description, item_price, item_available, item_power)
VALUES ('Dagger', 3, 'Stick them with the pointy end.', 8, TRUE, 10),
('Cape', 5, 'It will keep you warm. And capes are so in right now.', 3, TRUE, 1),
('Walking stick', 10, 'For old people to walk. Can also be used to beat people.', 2, TRUE, 2),
('Toothbrush', 2, '79% of medieval dentists believe dental hygiene can keep you alive.', 10, TRUE, 20),
('Magic Sword', 5, 'Its magic and therefor cool', 18, TRUE, 100),
('Wizards Hat', 8, 'For your head', 5, TRUE, 5),
('Pet Squirrel', 8, 'Can be tought some tricks. Will keep you company on the road and bite your opponents', 18, TRUE, 50),
('Apple', 8, 'Fruits are healthy, get some vitamins', 1, TRUE, 2);



INSERT INTO ownership (owner_id, item_id)
VALUES (1, 2), (1, 2), (2, 1), (3, 3), (4, 4), (4, 4);

COMMIT;
