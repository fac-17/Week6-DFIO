const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const helper = require("./helper");
const queries = require("./queries");
let userName;
// let password = "oneTwoOneTwo";

const handleHome = (request, response) => {
  const filePath = path.join(__dirname, "..", "public", "index.html");
   // FOR TESTS - temp
  fs.readFile(filePath, (err, file) => {
    if (err) {
      response.writeHead(500, { "content-type": "text/html" });
      response.end("Something went wrong with our dragons");
    } else {
      if (helper.checkCookie(request.headers.cookie)) {
        userName = helper.checkCookie(request.headers.cookie);
        response.writeHead(302, { Location: "/public/inventory.html" });
        response.end(file);
      }

      response.writeHead(200, { "content-type": "text/html" });
      response.end(file);
    }
  });
};

const handlePublic = (request, response) => {
  const extension = path.extname(request.url).substring(1);
  const extensionType = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    ico: "image/x-icon"
  };

  const filePath = path.join(__dirname, "..", request.url);
  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(500, { "content-type": "text/html" });
      response.end("Something went wrong with our dragons");
    } else {
      response.writeHead(200, { "content-type": extensionType[extension] });
      response.end(file);
    }
  });
};

const handleDbNewUser = (request, response) => {
  let userExists = "";
  helper.dataStreamer(request, data => {
    parsedData = querystring.parse(data);
    userName = parsedData.username;
    password = parsedData.password;
    console.log("username in handleDbNewUser", userName);
    console.log("password in handleDbNewUser", password);

    queries.checkExistingUsers(userName, (err, res) => {
      if (err) console.log(err);
      else {
        if (res.length > 0) {
          // user DOES exist – so need to pick other name (set front end alert)
          userExists = "True";
          console.log(`Does the user exist?`, userExists);
          response.writeHead(302, { Location: "/" });
          response.end(userExists);

        }
        else if (res.length === 0) {
          // user DOESN'T exist – so CREATE USER (hash pw and set cookie)
          helper.hashPassword(password, (err, hashPassword) => {
            if (err) console.log(err);
            else queries.createUser(userName, hashPassword);
          });
          const jwt = helper.createCookie(userName);
          response.writeHead(301,
            {
              Location: '/public/inventory.html',
              'Set-Cookie': `jwt=${jwt}; Max-Age=9000`
            });
          response.end();
        }
      }
    });
  });
};

const handleGetInventory = (request, response) => {
  queries.getInventory((err, res) => {
    if (err) console.log(err);
    else {
      const inventoryArray = JSON.stringify(res);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(inventoryArray);
    }
  });
};

const handleDbLogin = (request, response) => {
  let loginSuccesful;
  let storedPassword = "";
  helper.dataStreamer(request, data => {
    parsedData = querystring.parse(data);
    userName = parsedData.username;
    password = parsedData.password;
    queries.getStoredPassword(userName, (err, res) => {
      if (err) console.log(err);
      else {
        let storedPassword = res[0].hashed_password;
        helper.comparePasswords(password, storedPassword, (err, res) => {
        if (err) console.log(err);
        else if (res) {
          console.log(`Login successful!`);
          const jwt = helper.createCookie(userName);
          response.writeHead(302,
            {
              Location: '/public/inventory.html',
              'Set-Cookie': `jwt=${jwt}; Max-Age=9000` // NEED TO BE TESTED ONCE LOGIN ROUTE WORKS
            }
          );
          response.end();
        } else {
          console.log(`Login unsuccessful!`);
          response.writeHead(302, { Location: "/" });
          response.end(res);
        }
      })
      };
    });
  });
};



const handleRequestSatchel = (request,response) => {
  queries.getItemsOwnedBy(userName, (err, itemsOwned) => {
    if (err) console.log(err);
    itemsOwned = JSON.stringify(itemsOwned);
    // console.log(itemsOwned);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(itemsOwned);
  });
}
const handleBuyItem = (request, response) => {
  const itemToBuy = request.url.split("?")[1];
  console.log("userName in handleBuyItem", userName);
  queries.buyItem(userName, itemToBuy, (err, itemsOwned) => {
    if (err) console.log(err);
    queries.getItemsOwnedBy(userName, (err, itemsOwned) => {
      if (err) console.log(err);
      itemsOwned = JSON.stringify(itemsOwned);
      // console.log(itemsOwned);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(itemsOwned);
    });
  });
};

const handleGetUser = (request, response) => {
  queries.getUserData(userName, (err, res) => {
    // console.log('username in getUser',userName);
    if (err) console.log(err);
    userData = JSON.stringify(res);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(userData);
  });
};

module.exports = {
  handleHome,
  handlePublic,
  handleDbNewUser,
  handleGetInventory,
  handleDbLogin,
  handleGetUser,
  handleRequestSatchel,
  handleBuyItem
};
