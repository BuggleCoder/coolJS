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
  minigames: []
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertToRoman(num) {
  const romanMap = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];

  let result = '';

  for (const { value, numeral } of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }

  return result;
}

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
  minigameUI();
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

function minigameUI() {
  minigameEl.innerHTML = "";

  player.minigames.forEach((minigame, i) => {
    minigameEl.insertAdjacentHTML(
      "beforeend",
      `<div class="minigame" id="minigame${i}">${minigame}</div>`
    );
  });
}

function buyItem(index) {
  if (player.clicks >= shopItems[index].basePrice) {
    player.clicks -= shopItems[index].basePrice;
    if (shopItems[index].name == "Better Mice") {
      player.clickPower += 20;
    } else if (shopItems[index].name == "Dice Roller") {
      player.minigames.push("Dice Roller")
    } else {
      player.cps += shopItems[index].cpsBoost;
    }
    if (shopItems[index].name == "Site Revamp") {
      gameBtn.classList.add("new")
      shopItems.splice(3, 1);
      document.title = "Clicker Game"
    } else if (shopItems[index].name == "Better CSS") {
      gameBtn.classList.add("better")
      shopItems.splice(6, 1);
      document.title = "Better Clicker Game"
    }
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
