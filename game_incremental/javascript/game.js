
import shopItems from "../json/shop.json" with { type: "json" };



const gameBtn = document.getElementById("game-btn");
const scoreEl = document.getElementById("score");
const cpsEl = document.getElementById("cps");
const shopEl = document.getElementById("shop-btns");
const gameText = document.getElementById("game-message");

let COST_MULTIPLIER = 1.15;

export const player = {
  cps: 0,
  clicks: 0,
  clickPower: 1000000000,
  removedItems: [],
  purchasedItems: [],
  itemQuantities: {},
  totalClicks: 0
};

let lastTime = null;
let currentShopKey = null;
let animationStarted = false;

function formatNumber(num) {
  if (num === Infinity) return "Infinity";
  if (!Number.isFinite(num) || num < 0) return "0";

  if (num < 1000000) {
    return Math.floor(num).toLocaleString();
  }

  const suffixes = [
    "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc",
    "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc",
    "SxDc", "SpDc", "OcDc", "NoDc", "Vg"
  ];

  const tier = Math.floor(Math.log10(num) / 3);

  if (tier >= suffixes.length) {
    return num.toExponential(2);
  }

  return `${(num / Math.pow(10, tier * 3)).toFixed(2)} ${suffixes[tier]}`;
}

function getItemPrice(item, index) {
  const basePrice = Number(item.basePrice);

  if (!Number.isFinite(basePrice) || basePrice < 0) {
    return Infinity;
  }

  const amountOwned = player.itemQuantities[index] || 0;
  const price = basePrice * Math.pow(COST_MULTIPLIER, amountOwned);

  return Number.isFinite(price) ? Math.floor(price) : Infinity;
}

function isRemoved(index) {
  return player.removedItems.includes(index);
}

function canShowItem(item, index) {
  const price = getItemPrice(item, index);
  const amountOwned = player.itemQuantities[index] || 0;

  if (
    Number.isFinite(item.maxOwned) &&
    amountOwned >= item.maxOwned
  ) {
    return false;
  }

  return (
    !isRemoved(index) &&
    Number.isFinite(price) &&
    price <= player.clicks * 2
  );
}

function getVisibleItems() {
  return shopItems
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => canShowItem(item, index));
}

function shopUI() {
  if (!shopEl) return;

  const visibleItems = getVisibleItems();
  const visibleKey = visibleItems.map(({ index }) => index).join(",");

  if (visibleKey !== currentShopKey) {
    currentShopKey = visibleKey;
    shopEl.replaceChildren();

    for (const { item, index } of visibleItems) {
      const button = document.createElement("button");
      button.type = "button";
      button.id = `shopBtn${index}`;
      button.className = "shopBtn";

      const icon = document.createElement("img");
      icon.className = "btn-icon";
      icon.src = item.icon || "img/upgrades/autoclicker.png";
      icon.alt = item.name || "Item icon";

      const name = document.createElement("span");
      name.className = "btn-name";

      const price = document.createElement("span");
      price.id = `shopBtn${index}Price`;
      price.className = "btn-price";

      button.append(icon, name, price);
      button.addEventListener("click", () => buyItem(index));
      shopEl.appendChild(button);
    }
  }

  for (const { item, index } of visibleItems) {
    const button = document.getElementById(`shopBtn${index}`);
    if (!button) continue;

    const nameSpan = button.querySelector(".btn-name");
    const priceSpan = document.getElementById(`shopBtn${index}Price`);

    if (!nameSpan || !priceSpan) continue;

    const cost = getItemPrice(item, index);

    nameSpan.textContent = String(item.name ?? `Item ${index + 1}`);
    priceSpan.textContent =
      `Costs ${formatNumber(cost)} · Owned: ${player.itemQuantities[index] || 0}`;

    button.disabled = player.clicks < cost;
    button.classList.toggle("disabled", button.disabled);
  }
}

function updateUI() {
  if (scoreEl) {
    scoreEl.textContent = formatNumber(player.clicks);
  }

  if (cpsEl) {
    cpsEl.textContent =
      player.cps < 1000
        ? player.cps.toFixed(1)
        : formatNumber(player.cps);
  }
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
    const earned = player.cps * deltaTime;
    player.clicks += earned;
    player.totalClicks += earned;
  }

  if (player.totalClicks >= 1000000000) {
    COST_MULTIPLIER = 1.2;
  }
  updateUI();
  requestAnimationFrame(gameLoop);
}

function buyItem(index) {
  if (!Number.isInteger(index)) return;

  const item = shopItems[index];

  if (!item || isRemoved(index)) return;

  const amountOwned = player.itemQuantities[index] || 0;

  if (
    Number.isFinite(item.maxOwned) &&
    amountOwned >= item.maxOwned
  ) {
    return;
  }

  const price = getItemPrice(item, index);

  if (!Number.isFinite(price) || player.clicks < price) {
    return;
  }

  const name = String(item.name ?? "");

  if (!name) return;

  player.clicks -= price;
  player.itemQuantities[index] = amountOwned + 1;
  player.purchasedItems.push(index);

  if (name === "Better Mice") {
    player.clickPower += 20;
  } else {
    const boost = Number(item.cpsBoost);

    if (Number.isFinite(boost) && boost > 0) {
      player.cps += boost;
    }
  }

  const specialItems = {
    "Monkey Business": {
      clickPower: 100,
      message: "Monkeys are good for business—as a new study shows..."
    },
    "Questionable Interns": {
      message: "They don't remember applying for the job..."
    },
    "Banana Research Lab": {
      clickPower: 2000,
      message: "Results: Potassium"
    }
  };

  const special = specialItems[name];

  if (special) {
    if (Number.isFinite(special.clickPower)) {
      player.clickPower += special.clickPower;
    }

    if (gameText && special.message) {
      gameText.textContent = special.message;
    }
  }

  updateUI();
}

if (gameBtn) {
  gameBtn.addEventListener("click", () => {
    player.clicks += player.clickPower;
    player.totalClicks += player.clickPower;

    updateUI();
    gameBtn.blur();
  });
}

updateUI();

if (!animationStarted) {
  animationStarted = true;
  requestAnimationFrame(gameLoop);
}
