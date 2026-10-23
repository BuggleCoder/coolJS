import shopItems from "./json/shop.json" with { type: "json" };

let gameBtn = document.getElementById("game-btn");
let scoreEl = document.getElementById("score");
let cpsEl = document.getElementById("cps");
let shopEl = document.getElementById("shop-btns");
let minigameEl = document.getElementById("minigame-container");

let player = {
  cps: 0,
  clicks: 0,
  clickPower: 1,
};

let lastTime = 0;
let currentlyVisibleCount = 0;

function shopUI() {
  let visibleItems = shopItems.filter(
    (item) => item.basePrice / 2 <= player.clicks,
  );

  if (visibleItems.length !== currentlyVisibleCount) {
    currentlyVisibleCount = visibleItems.length;
    shopEl.innerHTML = "";

    for (let i = 0; i < shopItems.length; i++) {
      if (shopItems[i].basePrice / 2 <= player.clicks) {
        shopEl.insertAdjacentHTML(
          "beforeend",
          `<button class="shopBtn" id="shopBtn${i}">
            <span class="btn-name">${shopItems[i].name}</span>
            <span id="shopBtn${i}Price" class="btn-price">Costs ${shopItems[i].basePrice}</span>
          </button>`,
        );

        document
          .getElementById(`shopBtn${i}`)
          .addEventListener("click", () => buyItem(i));
      }
    }
  } else {
    for (let i = 0; i < shopItems.length; i++) {
      let priceEl = document.getElementById(`shopBtn${i}Price`);
      let btnEl = document.getElementById(`shopBtn${i}`);
      if (priceEl && btnEl) {
        priceEl.textContent = `Costs ${shopItems[i].basePrice}`;

        if (player.clicks < shopItems[i].basePrice) {
          btnEl.classList.add("disabled");
        } else {
          btnEl.classList.remove("disabled");
        }
      }
    }
  }
}

function updateUI() {
  scoreEl.textContent = Math.floor(player.clicks);
  cpsEl.textContent = player.cps.toFixed(1);
  shopUI();
}

function gameLoop(currentTime) {
  if (!lastTime) lastTime = currentTime;
  let deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (player.cps > 0) {
    player.clicks += player.cps * deltaTime;
  }

  scoreEl.textContent = Math.floor(player.clicks);
  shopUI();

  requestAnimationFrame(gameLoop);
}

function buyItem(index) {
  if (player.clicks >= shopItems[index].basePrice) {
    player.clicks -= shopItems[index].basePrice;
    player.cps += shopItems[index].cpsBoost;
    if (index == 2) {}
    updateUI();
  }
}

gameBtn.addEventListener("click", function () {
  player.clicks += player.clickPower;
  updateUI();
  gameBtn.blur();
});

requestAnimationFrame(gameLoop);
updateUI();
