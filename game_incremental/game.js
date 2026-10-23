let gameBtn = document.getElementById("game-btn");
let scoreEl = document.getElementById("score");
let cpsEl = document.getElementById("cps");

let player = {
  cps: 0,
  clicks: 0,
  clickPower: 1,
};

function updateUI() {
  scoreEl.textContent = player.clicks;
  cpsEl.textContent = player.cps;
}

gameBtn.addEventListener("click", function () {
  player.clicks += player.clickPower;
  updateUI();
  gameBtn.blur();
});

updateUI();

setInterval(function () {
  player.clicks += player.cps;
  updateUI();
}, 1000);
