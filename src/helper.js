const bcrypt = require("bcryptjs");


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

module.exports = { dataStreamer, hashPassword, comparePasswords };
