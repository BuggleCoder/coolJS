let gameBtn = document.getElementById("game-btn");
let scoreEl = document.getElementById("score");
let cpsEl = document.getElementById("cps");

let player = {
  cps: 0,
  clicks: 0,
  clickPower: 1,
};

let lastTime = performance.now();

function updateUI() {
  scoreEl.textContent = Math.floor(player.clicks);
  cpsEl.textContent = player.cps.toFixed(1);
}

gameBtn.addEventListener("click", function () {
  player.clicks += player.clickPower;
  updateUI();
  gameBtn.blur();
});

function gameLoop(currentTime) {
  const delta = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (player.cps > 0) {
    player.clicks += player.cps * delta;
    updateUI();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
updateUI();
