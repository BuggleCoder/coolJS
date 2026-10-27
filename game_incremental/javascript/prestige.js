import { player } from './game.js';

function checkPrestige() {
    const digits = Math.floor(Math.log10(Math.abs(player.totalClicks))) + 1;
    player.prestige = digits >= 6 ? digits - 6 : 0;
}