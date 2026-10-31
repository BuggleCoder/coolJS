import flavor from "../json/flavorText.json" with { type: "json" };
import { player } from "./game.js";

const gameText = document.getElementById("game-message");

export function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}

function flavorText() {
  if (!gameText || !player) return;

  const date = new Date();
  const month = date.getMonth();

  if (month >= 2 && month <= 4) {
    player.season = "spring";
  } else if (month >= 5 && month <= 7) {
    player.season = "summer";
  } else if (month >= 8 && month <= 10) {
    player.season = "fall";
  } else {
    player.season = "winter";
  }

  if (month === 9) {
    player.holiday = "halloween";
  } else if (month === 11) {
    player.holiday = "christmas";
  } else {
    player.holiday = "nothing";
  }

  const pools = [];

  if (
    player.holiday !== "nothing" &&
    Array.isArray(flavor[player.holiday]) &&
    flavor[player.holiday].length > 0
  ) {
    pools.push({
      messages: flavor[player.holiday],
      weight: 5
    });
  }

  if (
    Array.isArray(flavor[player.season]) &&
    flavor[player.season].length > 0
  ) {
    pools.push({
      messages: flavor[player.season],
      weight: 5
    });
  }

  if (Array.isArray(flavor.uncommon) && flavor.uncommon.length > 0) {
    pools.push({
      messages: flavor.uncommon,
      weight: 2
    });
  }

  if (Array.isArray(flavor.common) && flavor.common.length > 0) {
    pools.push({
      messages: flavor.common,
      weight: 8
    });
  }

  if (pools.length === 0) return;

  const totalWeight = pools.reduce((total, pool) => total + pool.weight, 0);
  let roll = Math.random() * totalWeight;
  let selectedPool = pools[pools.length - 1];

  for (const pool of pools) {
    roll -= pool.weight;

    if (roll < 0) {
      selectedPool = pool;
      break;
    }
  }

  const messages = selectedPool.messages;
  gameText.textContent = messages[Math.floor(Math.random() * messages.length)];
}

function seasonal() {
  const month = new Date().getMonth();

  if (month >= 2 && month <= 4) {
    player.season = "spring";
  } else if (month >= 5 && month <= 7) {
    player.season = "summer";
  } else if (month >= 8 && month <= 10) {
    player.season = "fall";
  } else {
    player.season = "winter";
  }

  if (month === 9) {
    player.holiday = "halloween";
  } else if (month === 11) {
    player.holiday = "christmas";
  } else {
    player.holiday = "";
  }
}

seasonal();

setInterval(flavorText, 5500);
flavorText();