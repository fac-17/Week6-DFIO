const bcrypt = require("bcryptjs");
const { parse } = require('cookie');
const { sign, verify } = require('jsonwebtoken');
const SECRET = 'thereWasNoDimensionsFestival';

const comparePasswords = (password, hashedPassword, callback) => {
  console.log(`The hashed password from the user is: `, password);
  console.log(`The hashed password from the DB is: `, hashedPassword);
  bcrypt.compare(password, hashedPassword, callback);
};

const hashPassword = (password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      callback(err);
    } else {
      bcrypt.hash(password, salt, callback);
    }
  });
};

const dataStreamer = (request, cb) => {
  let allTheData = "";
  request.on("data", chunk => {
    allTheData += chunk;
  });
  request.on("end", () => {
    cb(allTheData);
  });
};

const createCookie = (name) => {
  const userDetails = {
    userName: name,
    logged_in: 'true',
  }
  return sign(userDetails, SECRET)
}

const checkCookie = (rawCookie) => {
  
  if (!rawCookie) {
    console.log('no cookie');
    return false;
}
  const { jwt } = parse(rawCookie);

  if (!jwt) {
    console.log('no jwt cookie');
    return false;
  }
  return verify(jwt, SECRET, (err, jwt) => {
    if (err) {
      console.log(err);
      return false;
    }
    else {
      if (jwt.logged_in !== 'true') {
        console.log('not logged in');
        return false;
      }
      else {
        console.log("JWT IS ", jwt);
        return jwt.userName;
      }
    }
  });
}

module.exports = { dataStreamer, hashPassword, comparePasswords, createCookie, checkCookie };
