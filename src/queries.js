const databaseConnection = require("./database/db_connection");

const createUser = (userName, password) => {
  databaseConnection.query(
    `INSERT INTO users (name, hashed_password) VALUES ('${userName}', '${password}');`,
    (err, res) => {
      if (err) {
        throw new Error("Enter a name or password");
      }
    }
  );
};

const checkExistingUsers = (requestedName, cb) => {
  databaseConnection.query(
    `SELECT id FROM users WHERE name = '${requestedName}'`,
    (err, res) => {
      if (err) {
        cb(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const getStoredPassword = (userName, cb) => {
  databaseConnection.query(
    `SELECT hashed_password FROM users WHERE name = '${userName}'`,
    (err, res) => {
      if (err) {
        cb(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const getUsers = cb => {
  databaseConnection.query("SELECT * FROM users ORDER BY id", (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, res.rows);
    }
  });
};

const getUserData = (name, cb) => {
  databaseConnection.query(
    `SELECT name, gold_pieces FROM users WHERE name= $1`,
    [name],
    (err, res) => {
      if (err) {
        cb(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const getItemsOwnedBy = (username, cb) => {
  databaseConnection.query(
    `
    SELECT item_name, item_description, item_power
    FROM users INNER JOIN ownership ON users.id = ownership.owner_id
    INNER JOIN inventory
    ON ownership.item_id = inventory.id
    WHERE name= '${username}'`,
    (err, res) => {
      if (err) {
        cb(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const getInventory = cb => {
  databaseConnection.query(
    "SELECT item_name,item_quantity,item_price FROM inventory ORDER BY id",
    (err, res) => {
      if (err) {
        cb(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const getOwnership = cb => {
  databaseConnection.query(
    "SELECT * FROM ownership ORDER BY id",
    (err, res) => {
      if (err) {
        cb(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const buyItem = (user_name, item_name, cb) => {
  item_name = decodeURI(item_name);
  const dbQuery = `UPDATE users SET gold_pieces = gold_pieces - (SELECT item_price from inventory WHERE item_name = '${item_name}') WHERE name = '${user_name}';
    UPDATE inventory SET item_quantity = item_quantity - 1 WHERE item_name = '${item_name}';
    INSERT INTO ownership(owner_id, item_id)
    VALUES ((SELECT id FROM users WHERE name = '${user_name}' LIMIT 1), (SELECT id FROM inventory WHERE item_name = '${item_name}' LIMIT 1));`;
  databaseConnection.query(dbQuery, (err, res) => {
    if (err) cb(err);
    else {
      cb(null);
    }
  });
};

const getScoreByUser = (userId, cb) => {
  databaseConnection.query(
    `SELECT SUM(item_power)
    FROM ownership
    INNER JOIN inventory
    ON ownership.item_id = inventory.id
    WHERE ownership.owner_id = ${userId}`,
    (err, res) => {
      if (err) cb(err);
      else {
        cb(null, res.rows);
      }
    }
  );
};

const getAllScores = cb => {
  databaseConnection.query(
    `SELECT row_number() OVER() as position,users.name, SUM(inventory.item_power) AS total_power
    FROM users
    INNER JOIN ownership
    ON users.id = ownership.owner_id
    INNER JOIN inventory
    ON inventory.id = ownership.item_id
    GROUP BY users.id
    ORDER BY total_power DESC`,
    (err, res) => {
      if (err) cb(err);
      else {
        cb(null, res.rows);
      }
    }
  );
};

const checkEnoughGold = (userName, itemName, cb) => {
  decodedItemName = decodeURI(itemName);
  databaseConnection.query(
    `SELECT (SELECT gold_pieces FROM users WHERE name = '${userName}') - (SELECT item_price FROM inventory WHERE inventory.item_name = '${decodedItemName}')`,
    (err, res) => {
      if (err) cb(err);
      else {
        const valueDiff = res.rows[0]["?column?"];
        const enoughGold = valueDiff >= 0 ? true : false;
        cb(null, enoughGold);
      }
    }
  );
};

module.exports = {
  getUsers,
  getItemsOwnedBy,
  getInventory,
  getOwnership,
  buyItem,
  getScoreByUser,
  getAllScores,
  createUser,
  getUserData,
  checkExistingUsers,
  getStoredPassword,
  checkEnoughGold
};
