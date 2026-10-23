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

function initShop() {
  shopEl.innerHTML = "";
  shopItems.forEach((item, index) => {
    let btn = document.createElement("button");
    btn.id = `buy-${item.id}`;
    btn.className = "shop-btn";
    btn.textContent = `Buy ${item.name} (${item.cost} clicks) | +${item.cpsBonus} CPS`;

    btn.disabled = player.clicks < item.cost;

    btn.addEventListener("click", () => buyItem(item, btn));
    shopEl.appendChild(btn);
  });
}

function buyItem(item, btn) {
  if (player.clicks >= item.cost) {
    player.clicks -= item.cost;
    player.cps += item.cpsBonus;

    item.cost = Math.ceil(item.cost * 1.15);

    updateUI();
  }
}

function updateUI() {
  scoreEl.textContent = Math.floor(player.clicks);
  cpsEl.textContent = player.cps.toFixed(1);

  shopItems.forEach((item) => {
    let btn = document.getElementById(`buy-${item.id}`);
    if (btn) {
      btn.disabled = player.clicks < item.cost;
      btn.textContent = `Buy ${item.name} (${item.cost} clicks) | +${item.cpsBonus} CPS`;
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
