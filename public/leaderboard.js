const getLeaderboardData = () => {
  const xhr = new XMLHttpRequest();
  const url = "/getleaderboard";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const leaderboardArray = JSON.parse(xhr.responseText);
      populateLeaderboardTable(leaderboardArray);
    }
  };
  xhr.open("GET", url);
  xhr.send();
};

const populateLeaderboardTable = arr => {
  const leaderboardTable = document.querySelector(
    ".leaderboard-table tbody"
  );

  while (leaderboardTable.children.length > 1) {
        leaderboardTable.removeChild(inventoryTable.lastChild);
    }

  console.log({ arr });
  arr.forEach((item, index) => {
    let newItem = document.createElement("tr");
    // Item details filled in
    let newItemName = document.createElement("td");
    newItemName.classList.add('leaderboard-cell');
    newItemName.innerText = item.name;
    newItem.appendChild(newItemName);
    let newItemPower = document.createElement("td");
    newItemPower.classList.add('leaderboard-cell');
    newItemPower.innerText = item.total_power;
    newItem.appendChild(newItemPower);
    // Full new row added
    leaderboardTable.appendChild(newItem);
  });
};
getLeaderboardData()
