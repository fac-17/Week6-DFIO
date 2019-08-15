const getInventoryData = () => {
  const xhr = new XMLHttpRequest();
  const url = "/getinventory";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const inventoryArray = JSON.parse(xhr.responseText);
      populateInventoryTable(inventoryArray);
    }
  };
  xhr.open("GET", url);
  xhr.send();
};

const getUserData = () => {
  const xhr = new XMLHttpRequest();
  const url = "/getuser";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const userData = JSON.parse(xhr.responseText);
      populateUserData(userData);
    }
  };
  xhr.open("GET", url);
  xhr.send();
};

const requestSatchel = () => {
  const xhr = new XMLHttpRequest();
  const url = `/requestsatchel`
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200 ) {
      const satchel = JSON.parse(xhr.responseText);
      populateSatchel(satchel);
    }
  }
xhr.open('GET', url)
xhr.send()
};

getInventoryData();
getUserData();
requestSatchel();



const populateInventoryTable = arr => {
  const inventoryTable = document.querySelector(".inventory_table");
  while (inventoryTable.firstChild) {
    inventoryTable.firstChild.remove();
  }
  arr.forEach(item => {
    let newItem = document.createElement("tr");
    // Item details filled in
    let newItemName = document.createElement("th");
    newItemName.innerText = item.item_name;
    newItem.appendChild(newItemName);
    let newItemQuantity = document.createElement("th");
    newItemQuantity.innerText = item.item_quantity;
    newItem.appendChild(newItemQuantity);
    let newItemPrice = document.createElement("th");
    newItemPrice.innerText = item.item_price;
    newItem.appendChild(newItemPrice);
    // Button added
    let newItemButton = document.createElement("button");
    newItemButton.innerText = "Buy now";
    newItemButton.classList.add("buy-now");
    newItemButton.setAttribute("onclick", `buyItem('${item.item_name}')`);
    newItem.appendChild(newItemButton);
    // Full new row added
    inventoryTable.appendChild(newItem);
  });
};

const populateUserData = arr => {
  const userDetails = document.querySelector(".user_details");
  const name = arr[0].name;
  const gold = arr[0].gold_pieces;
  userDetails.innerText = `User name: ${name} Coins left: ${gold}`;
};

const buyItem = itemName => {
  const xhr = new XMLHttpRequest();
  const url = `/buyitem?${itemName}`;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const updatedSatchel = JSON.parse(xhr.responseText);
      //update inventory
      getInventoryData();
      getUserData();
      populateSatchel(updatedSatchel);
    }
  };
  xhr.open("GET", url);
  xhr.send();
};

const populateSatchel = arr => {
  console.log("purchase arr: ", arr);
  const satchelTable = document.querySelector(".satchel_table");
  while (satchelTable.firstChild) {
    satchelTable.firstChild.remove();
  }
  console.log(JSON.stringify(satchelTable));
  arr.forEach(item => {
    let newItem = document.createElement("tr");
    // Item details filled in
    let newItemName = document.createElement("th");
    newItemName.innerText = item.item_name;
    newItem.appendChild(newItemName);
    let newItemDescription = document.createElement("th");
    newItemDescription.innerText = item.item_description;
    newItem.appendChild(newItemDescription);
    let newItemPower = document.createElement("th");
    newItemPower.innerText = item.item_power;
    newItem.appendChild(newItemPower);
    // Full new row added
    satchelTable.appendChild(newItem);
  });
};

// const request = (url,cb) => {
//   const xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = () => {
//     if(xhr.readyState === 4 && xhr.status === 200)
//     {
//       cb(null, xhr.responseText);
//     }
//     else{
//       cb(new Error);
//     }
//   }
//   xhr.open('GET', url, )
// }
