const gameBtn = document.getElementById('game-btn');
const scoreEl = document.getElementById('score');
const cpsEl = document.getElementById('cps');
const shopEl = document.getElementById('shop-btns');
const gameText = document.getElementById('game-message');

import flavor from '../json/flavorText.json' with { type: 'json' };
import {player} from "../javascript/game";

let now = new Date();

function flavorText() {
  const commonTexts = flavor.common;
  const randomIndex = Math.floor(Math.random() * commonTexts.length);
  const selectedText = commonTexts[randomIndex];


  gameText.innerHTML = `<p>${selectedText}</p>`;
}

function seasonal() {
  const month = new Date().getMonth();

  if (month >= 0 && month <= 2) {
    player.season = "winter"; 
  } else if (month >= 3 && month <= 5) {
    player.season = "spring";
  } else if (month >= 6 && month <= 8) {
    player.season = "summer";
  } else {
    player.season = "fall";
  }

  if (month == 9) {
    player.holiday = "halloween";
  } else if (month == 0) {
    player.holiday = "winter_santa";
  } else if (month == 2) {
    player.holiday = "spring_egg";
  } else {
    player.holiday = "nothing"
  }
}


setInterval(flavorText, 5500);

flavorText();
