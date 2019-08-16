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

const backendValidation = (user, pw) => {
  let userRegex = RegExp("[a-z0-9]+");
  let pwRegex = RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,30}$");

  if (!userRegex.test(user)) {console.log('Backend username validation fails')}
  if (!pwRegex.test(user)) {console.log('Backend password validation fails')}

  if (userRegex.test(user) && pwRegex.test(pw)) {
    //console.log("Backend validation passes (helper.js)");
    return true;
  } else {
    //console.log("Backend validation FAILS (helper.js)");
    return false;
  }
}

module.exports = { dataStreamer, hashPassword, comparePasswords, createCookie, checkCookie, backendValidation };
