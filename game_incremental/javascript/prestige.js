import { player } from './game.js';
import prestigeItems from "../json/prestige.json" with { type: "json" };


export const rebirthSection = document.getElementById('rebirth-section'); 
export const rebirthBtn = document.getElementById('rebirth'); 


export function checkPrestige() {
  const clicks = Math.max(1, Math.abs(player.totalClicks));
  const digits = Math.floor(Math.log10(clicks)) + 1;
  
  player.prestige = digits >= 6 ? digits - 6 : 0; 
}

export function rebirthUI() {
  checkPrestige();
  if (player.prestige) {
    rebirthSection.innerHTML = "";
    let i = 0;
    prestigeItems.forEach(function () {})
  }
}
