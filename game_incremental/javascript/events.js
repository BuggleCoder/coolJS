import flavor from "../json/flavorText.json" with { type: "json" };
import { player } from "./game.js";

const gameText = document.getElementById("game-message");

function flavorText() {
  if (!gameText) return;

  const useSeasonal = Math.random() < 0.5;
  const seasonalMessages = flavor[player.holiday];
  const messages =
    useSeasonal && Array.isArray(seasonalMessages) && seasonalMessages.length > 0
      ? seasonalMessages
      : flavor.common;

  if (!Array.isArray(messages) || messages.length === 0) return;

  const selectedText = messages[Math.floor(Math.random() * messages.length)];
  gameText.textContent = selectedText;
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
    player.holiday = "nothing";
  }
}

seasonal();

setInterval(flavorText, 5500);
flavorText();