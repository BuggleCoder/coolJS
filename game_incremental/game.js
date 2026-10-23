let gameBtn = document.getElementById("game-btn");

let player = {
  cps: 0,
  clicks: 0,
  clickPower: 1,
};

function gameTick() {
  gameBtn.addEventListener("click", function () {
    player.clicks += player.clickPower;
    gameBtn.blur();
  });
  player.clicks += player.cps;
}

setInterval(1000, gameTick());
