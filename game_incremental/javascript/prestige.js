
import { player } from "./game.js";
import prestigeItems from "../json/prestige.json" with { type: "json" };

export const rebirthSection = document.getElementById("rebirth-section");
export const rebirthBtn = document.getElementById("rebirth");

export function checkPrestige() {
  const clicks = Math.max(0, player.totalClicks);
  const digits = clicks >= 1 ? Math.floor(Math.log10(clicks)) + 1 : 0;

  player.prestige = Math.max(0, digits - 5);
  return player.prestige;
}

export function rebirthUI() {
  if (!rebirthSection) return;

  checkPrestige();

  if (player.prestige) {

  } else {
    return;
  }
}
