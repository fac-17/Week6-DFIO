const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const helper = require("./helper");
const queries = require("./queries");
let userName;

const handleHome = (request, response) => {
  const filePath = path.join(__dirname, "..", "public", "index.html");
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

  if (
    filePath.includes(`/public/inventory.html`) &&
    !helper.checkCookie(request.headers.cookie)
  ) {
    response.writeHead(302, { Location: "/" });
    response.end();
  }
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
    // helper.backendValidation(userName, password); - Function to be finalised
    console.log("username in handleDbNewUser", userName);
    console.log("password in handleDbNewUser", password);

    queries.checkExistingUsers(userName, (err, res) => {
      if (err) console.log(err);
      else {
        if (res.length > 0) {
          // user DOES exist – so need to pick other name (set front end alert)
          userExists = "True";
          response.writeHead(302,
            {
              Location: "/",
              'Set-Cookie': `user=exists; Max-Age=3`
            });
          response.end(userExists);
        } else if (res.length === 0) {
          // user DOESN'T exist – so CREATE USER (hash pw and set cookie)
          helper.hashPassword(password, (err, hashPassword) => {
            if (err) console.log(err);
            else queries.createUser(userName, hashPassword);
          });
          const jwt = helper.createCookie(userName);
          response.writeHead(301, {
            Location: "/public/inventory.html",
            "Set-Cookie": `jwt=${jwt}; Max-Age=9000`
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

const handleGetLeaderboard = (request, response) => {
  queries.getAllScores((err,res) => {
    if(err) console.log(err);
    else{
      const leaderboardArray = JSON.stringify(res)
      console.log({leaderboardArray});
      response.writeHead(200, {'Content-Type':'application/json'});
      response.end(leaderboardArray);
    }
  })
}
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
            response.writeHead(302, {
              Location: "/public/inventory.html",
              "Set-Cookie": `jwt=${jwt}; Max-Age=9000`
            });
            response.end();
          } else {
            console.log(`Login unsuccessful!`);
            response.writeHead(302,
              {
                Location:'/',
                'Set-Cookie': `password=wrong; Max-Age=3`
              });
            response.end(res);
          }
        });
      }
    });
  });
};

const handleRequestSatchel = (request, response) => {
  queries.getItemsOwnedBy(userName, (err, itemsOwned) => {
    if (err) console.log(err);
    itemsOwned = JSON.stringify(itemsOwned);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(itemsOwned);
  });
};

const handleBuyItem = (request, response) => {
  const itemToBuy = request.url.split("?")[1];
  let enoughGold;
  queries.checkEnoughGold(userName, itemToBuy, (err, res) => {
    if (err) console.log(err);
    else enoughGold = res;
    if (enoughGold) {
      queries.buyItem(userName, itemToBuy, (err, itemsOwned) => {
        if (err) console.log(err);
        queries.getItemsOwnedBy(userName, (err, itemsOwned) => {
          if (err) console.log(err);
          itemsOwned = JSON.stringify(itemsOwned);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(itemsOwned);
        });
      });
    } else {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end(enoughGold);
    }
  });
};

const handleGetUser = (request, response) => {
  queries.getUserData(userName, (err, res) => {
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
  handleGetLeaderboard,
  handleDbLogin,
  handleGetUser,
  handleRequestSatchel,
  handleBuyItem
};
