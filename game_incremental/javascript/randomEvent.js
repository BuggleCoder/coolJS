const gameBtn = document.getElementById('game-btn');
const scoreEl = document.getElementById('score');
const cpsEl = document.getElementById('cps');
const shopEl = document.getElementById('shop-btns');
const gameText = document.getElementById('game-message');

import flavor from '../json/flavorText.json' with { type: 'json' };

function flavorText() {
  const commonTexts = flavor.common;
  const randomIndex = Math.floor(Math.random() * commonTexts.length);
  const selectedText = commonTexts[randomIndex];
  
  gameText.innerHTML = `<p>${selectedText}</p>`;
}

setInterval(flavorText, 5500);

flavorText();
