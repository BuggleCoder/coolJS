import shopItems from "./json/shop.json" with { type: "json" };

let gameBtn = document.getElementById("game-btn");
let scoreEl = document.getElementById("score");
let cpsEl = document.getElementById("cps");
let shopEl = document.getElementById("shop-btns");
let minigameEl = document.getElementById("minigame-container");

let player = {
  cps: 0,
  clicks: 0,
  clickPower: 1000,
  minigames: [],
  removedItems: [],
  purchasedItems: []
};

let lastTime = 0;
let currentlyVisibleItems = "";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertToRoman(num) {
  const romanMap = [
    { value: 1000, numeral: "M" },
    { value: 900, numeral: "CM" },
    { value: 500, numeral: "D" },
    { value: 400, numeral: "CD" },
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" }
  ];

  let result = "";

  for (const { value, numeral } of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }

  return result;
}

function shopUI() {
  const visibleItems = shopItems
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) =>
      !player.removedItems.includes(item.name) &&
      !player.purchasedItems.includes(index) &&
      item.basePrice / 2 <= player.clicks
    );

  const visibleKey = visibleItems
    .map(({ index }) => index)
    .join(",");

  if (visibleKey !== currentlyVisibleItems) {
    currentlyVisibleItems = visibleKey;
    shopEl.innerHTML = "";

    visibleItems.forEach(({ item, index }) => {
      shopEl.insertAdjacentHTML(
        "beforeend",
        `<button class="shopBtn" id="shopBtn${index}" type="button">
          <span class="btn-name">${item.name}</span>
          <span id="shopBtn${index}Price" class="btn-price">
            Costs ${item.basePrice}
          </span>
        </button>`
      );

      document
        .getElementById(`shopBtn${index}`)
        .addEventListener("click", () => buyItem(index));
    });
  }

  visibleItems.forEach(({ item, index }) => {
    const priceEl = document.getElementById(`shopBtn${index}Price`);
    const btnEl = document.getElementById(`shopBtn${index}`);

    if (priceEl && btnEl) {
      priceEl.textContent = `Costs ${item.basePrice}`;
      btnEl.disabled = player.clicks < item.basePrice;
      btnEl.classList.toggle("disabled", btnEl.disabled);
    }
  });
}

function minigameUI() {
  minigameEl.innerHTML = "<h2> Minigames <h2>";

  player.minigames.forEach((minigame, i) => {
    minigameEl.insertAdjacentHTML(
      "beforeend",
      `<div class="minigame" id="minigame${i}"><h3>${minigame}</h3></div>`
    );
  });
}

function updateUI() {
  scoreEl.textContent = Math.floor(player.clicks);
  cpsEl.textContent = player.cps.toFixed(1);

  shopUI();
  minigameUI();
}

function gameLoop(currentTime) {
  if (!lastTime) lastTime = currentTime;

  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (player.cps > 0) {
    player.clicks += player.cps * deltaTime;
  }

  updateUI();

  requestAnimationFrame(gameLoop);
}

function buyItem(index) {
  const item = shopItems[index];

  if (!item) return;
  if (player.removedItems.includes(item.name)) return;
  if (player.purchasedItems.includes(index)) return;
  if (player.clicks < item.basePrice) return;

  player.clicks -= item.basePrice;

  if (item.name === "Better Mice") {
    player.clickPower += 20;
  } else if (item.name === "Dice Roller") {
    player.minigames.push("Dice Roller");
  } else {
    player.cps += Number(item.cpsBoost) || 0;
  }

  if (item.name === "Site Revamp") {
    gameBtn.classList.add("new");
    player.removedItems.push(shopItems[3]?.name);
    document.title = "Clicker Game";
  } else if (item.name === "Better CSS") {
    gameBtn.classList.add("better");
    player.removedItems.push(shopItems[6]?.name);
    document.title = "Better Clicker Game";
  }

  player.purchasedItems.push(index);

  currentlyVisibleItems = "";
  updateUI();
}

gameBtn.addEventListener("click", function () {
  player.clicks += player.clickPower;
  updateUI();
  gameBtn.blur();
});

requestAnimationFrame(gameLoop);
updateUI();