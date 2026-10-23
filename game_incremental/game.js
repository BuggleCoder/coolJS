let gameBtn = document.getElementById("game-btn");

let scoreEl = document.getElementById("score");
let cpsEl = document.getElementById("cps");

let player = {
  cps: 0,
  clicks: 0,
  clickPower: 1,
};

gameBtn.addEventListener("click", function () {
  player.clicks += player.clickPower;
  gameBtn.blur();
});

scoreEl.textContent = player.clicks;
cpsEl.textContent = player.cps;

setInterval(function () {
  player.clicks += player.cps;
}, 1000);
