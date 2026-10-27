import { player } from './game.js';

export const rebirthSection = document.getElementById('rebirth-section'); 

export function checkPrestige() {
  const clicks = Math.max(1, Math.abs(player.totalClicks));
  const digits = Math.floor(Math.log10(clicks)) + 1;
  
  player.prestige = digits >= 6 ? digits - 6 : 0; 
}

export function rebirthUI() {
}
