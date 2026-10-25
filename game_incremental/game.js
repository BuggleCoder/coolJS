
import shopItems from "./json/shop.json" with { type: "json" };

const gameBtn = document.getElementById("game-btn");
const scoreEl = document.getElementById("score");
const cpsEl = document.getElementById("cps");
const shopEl = document.getElementById("shop-btns");
const gameText = document.getElementById("game-message");

if (!gameBtn || !scoreEl || !cpsEl || !shopEl) {
  throw new Error(
    "Clicker game initialization failed: check your HTML element IDs."
  );
}

if (
  !Array.isArray(shopItems) ||
  shopItems.some(
    item => !item || typeof item !== "object" || Array.isArray(item)
  )
) {
  throw new Error(
    "Shop initialization failed: shop.json must contain an array of objects."
  );
}

const player = {
  cps: 0,
  clicks: 0,
  clickPower: 1000,
  removedItems: [],
  purchasedItems: [],
};

let lastTime = null;
let currentShopKey = null;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    min > max
  ) {
    throw new RangeError("Invalid random integer range.");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertToRoman(num) {
  if (!Number.isSafeInteger(num) || num < 1) {
    return "";
  }

  const romanMap = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";

  for (const [value, numeral] of romanMap) {
    const count = Math.floor(num / value);
    result += numeral.repeat(count);
    num %= value;
  }

  return result;
}

function getItemPrice(item) {
  const price = Number(item.basePrice);

  return Number.isFinite(price) && price >= 0
    ? price
    : Infinity;
}

function isRemoved(index) {
  return player.removedItems.includes(index);
}

function canShowItem(item, index) {
  const price = getItemPrice(item);

  return (
    !isRemoved(index) &&
    Number.isFinite(price) &&
    price / 2 <= player.clicks
  );
}

function getVisibleItems() {
  return shopItems
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => canShowItem(item, index));
}

function shopUI() {
  const visibleItems = getVisibleItems();

  const visibleKey = visibleItems
    .map(({ index }) => index)
    .join(",");

  if (visibleKey !== currentShopKey) {
    currentShopKey = visibleKey;
    shopEl.replaceChildren();

    for (const { item, index } of visibleItems) {
      const button = document.createElement("button");

      button.type = "button";
      button.id = `shopBtn${index}`;
      button.className = "shopBtn";

      const name = document.createElement("span");
      name.className = "btn-name";
      name.textContent = String(
        item.name ?? `Item ${index + 1}`
      );

      const price = document.createElement("span");
      price.id = `shopBtn${index}Price`;
      price.className = "btn-price";

      button.append(name, price);
      button.addEventListener("click", () => buyItem(index));

      shopEl.appendChild(button);
    }
  }

  for (const { item, index } of visibleItems) {
    const button = document.getElementById(`shopBtn${index}`);
    const price = document.getElementById(`shopBtn${index}Price`);

    if (!button || !price) continue;

    const cost = getItemPrice(item);

    price.textContent = `Costs ${cost.toLocaleString()}`;

    button.disabled = player.clicks < cost;
    button.classList.toggle("disabled", button.disabled);
  }
}

function updateUI() {
  scoreEl.textContent = Math.floor(player.clicks).toLocaleString();
  cpsEl.textContent = player.cps.toFixed(1);

  shopUI();
}

function gameLoop(currentTime) {
  if (lastTime === null) {
    lastTime = currentTime;
  }

  let deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (!Number.isFinite(deltaTime) || deltaTime < 0) {
    deltaTime = 0;
  }

  deltaTime = Math.min(deltaTime, 1);

  if (player.cps > 0) {
    player.clicks += player.cps * deltaTime;
  }

  updateUI();
  requestAnimationFrame(gameLoop);
}

function buyItem(index) {
  if (!Number.isInteger(index)) return;

  const item = shopItems[index];

  // Allow repeat purchases; only removed items are blocked.
  if (!item || isRemoved(index)) return;

  const price = getItemPrice(item);

  if (!Number.isFinite(price) || player.clicks < price) {
    return;
  }

  const name = String(item.name ?? "");

  if (!name) return;

  player.clicks -= price;
  player.purchasedItems.push(index);

  if (name === "Better Mice") {
    player.clickPower += 20;
  } else {
    const boost = Number(item.cpsBoost);

    if (Number.isFinite(boost) && boost > 0) {
      player.cps += boost;
    }
  }

  if (name === "Site Revamp") {
    gameBtn.classList.add("new");
    document.title = "Clicker Game";
  }

  if (name === "Site Revamp II") {
    gameBtn.classList.add("better");
    document.title = "Better Clicker Game";

    if (gameText) {
      gameText.textContent = "Welcome to Better Clicker Game";
    }
  }

  if (name === "Monkey Business") {
    player.clickPower += 100;

    if (gameText) {
      gameText.textContent =
        "Monkeys are good for business—as a new study shows...";
    }
  }

  if (name === "Questionable Interns") {
    if (gameText) {
      gameText.textContent =
        "They don't remember applying for the job...";
    }
  }

  updateUI();
}

gameBtn.addEventListener("click", () => {
  player.clicks += player.clickPower;
  updateUI();
  gameBtn.blur();
});

updateUI();
requestAnimationFrame(gameLoop);
