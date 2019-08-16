const bcrypt = require("bcryptjs");
const { parse } = require("cookie");
const { sign, verify } = require("jsonwebtoken");
const SECRET = "thereWasNoDimensionsFestival";

const comparePasswords = (password, hashedPassword, callback) => {
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

const createCookie = name => {
  const userDetails = {
    userName: name,
    logged_in: "true"
  };
  return sign(userDetails, SECRET);
};

const checkCookie = rawCookie => {
  if (!rawCookie) {
    console.log("Client has no cookie");
    return false;
  }
  const { jwt } = parse(rawCookie);

  if (!jwt) {
    console.log("Client has no JWT token");
    return false;
  }
  return verify(jwt, SECRET, (err, jwt) => {
    if (err) {
      console.log(err);
      return false;
    } else {
      if (jwt.logged_in !== "true") {
        console.log("Not logged in");
        return false;
      } else {
        console.log(`JWT Token found`);
        return jwt.userName;
      }
    }
  });
};

module.exports = {
  dataStreamer,
  hashPassword,
  comparePasswords,
  createCookie,
  checkCookie
};
