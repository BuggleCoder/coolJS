const gameBtn = document.getElementById("game-btn");
const scoreEl = document.getElementById("score");
const cpsEl = document.getElementById("cps");
const shopEl = document.getElementById("shop-btns");
const gameText = document.getElementById("game-message");

import { player } from "./game";

export function randomFlavor() {
    if ((Math.random() * 100).toFixed(2) >= 99) {
        let rareishText = ["Made by Benjamin Franklin", "Chairman Dao is the best"]

        gameText.textContent = rareishText[(Math.floor(Math.random() * rareishText.length))]
    }
}
