import shopItems from "./json/shop.json" assert { type: "json" };

let gameBtn = document.getElementById("game-btn");
let scoreEl = document.getElementById("score");
let cpsEl = document.getElementById("cps");
let shopEl = document.getElementById("shop-btns");

let player = {
  cps: 0,
  clicks: 0,
  clickPower: 1,
};

let lastTime = performance.now();

// Convert string values from JSON to numbers safely if needed
shopItems.forEach((item) => {
  item.basePrice = Number(item.basePrice);
  item.cps = Number(item.cps);
});

function initShop() {
  shopEl.innerHTML = "";
  shopItems.forEach((item) => {
    let btn = document.createElement("button");
    // Fallback to name if id is missing in JSON
    const itemId = item.id || item.name.toLowerCase();
    btn.id = `buy-${itemId}`;
    btn.className = "shop-btn";
    btn.textContent = `Buy ${item.name} (${item.basePrice} clicks) | +${item.cps} CPS`;

    btn.disabled = player.clicks < item.basePrice;

    btn.addEventListener("click", () => buyItem(item));
    shopEl.appendChild(btn);
  });
}

function buyItem(item) {
  if (player.clicks >= item.basePrice) {
    player.clicks -= item.basePrice;
    player.cps += item.cps;

    item.basePrice = Math.ceil(item.basePrice * 1.15);

    updateUI();
  }
}

function updateUI() {
  scoreEl.textContent = Math.floor(player.clicks);
  cpsEl.textContent = player.cps.toFixed(1);

  shopItems.forEach((item) => {
    const itemId = item.id || item.name.toLowerCase();
    let btn = document.getElementById(`buy-${itemId}`);
    if (btn) {
      btn.disabled = player.clicks < item.basePrice;
      btn.textContent = `Buy ${item.name} (${item.basePrice} clicks) | +${item.cps} CPS`;
    }
  });
}

function gameLoop(currentTime) {
  const delta = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (player.cps > 0) {
    player.clicks += player.cps * delta;
    updateUI();
  }

  requestAnimationFrame(gameLoop);
}

gameBtn.addEventListener("click", function () {
  player.clicks += player.clickPower;
  updateUI();
  gameBtn.blur();
});

initShop();
requestAnimationFrame(gameLoop);
updateUI();
