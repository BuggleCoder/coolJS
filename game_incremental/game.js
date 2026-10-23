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

function shopUI() {
  for (let i = 0; i < shopItems.length(); i++) {
    if (shopItems[i].basePrice / 2 <= player.clicks) {
      shopEl.append(
        `<button class="shopBtn" id="shopBtn${i}">${shopItems[i].name}<button>`,
      );
    }
  }
}

function updateUI() {
  scoreEl.textContent = Math.floor(player.clicks);
  cpsEl.textContent = player.cps.toFixed(1);
  shopUI();
}

function gameLoop(currentTime) {
  if (player.cps > 0) {
    player.clicks += player.cps;
    updateUI();
  }

  requestAnimationFrame(gameLoop);
}

gameBtn.addEventListener("click", function () {
  player.clicks += player.clickPower;
  updateUI();
  gameBtn.blur();
});

requestAnimationFrame(gameLoop);
updateUI();
