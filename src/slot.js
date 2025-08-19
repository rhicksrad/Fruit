import { rngInt } from './utils.js';

export const Symbols = [
  { key: 'cherry', emoji: '🍒', weight: 24, payout: 10 },
  { key: 'lemon', emoji: '🍋', weight: 20, payout: 12 },
  { key: 'grape', emoji: '🍇', weight: 16, payout: 16 },
  { key: 'orange', emoji: '🍊', weight: 14, payout: 20 },
  { key: 'melon', emoji: '🍉', weight: 10, payout: 28 },
  { key: 'bell', emoji: '🔔', weight: 8, payout: 40 },
  { key: 'star', emoji: '⭐', weight: 5, payout: 80 },
  { key: 'seven', emoji: '7️⃣', weight: 3, payout: 160 },
];

const weighted = [];
Symbols.forEach((s, i) => {
  for (let k = 0; k < s.weight; k++) weighted.push(i);
});

export function rollSymbolIndex() {
  const idx = weighted[rngInt(0, weighted.length - 1)];
  return idx;
}

export function computePayoutLine([a, b, c], bet) {
  if (a === b && b === c) return Symbols[a].payout * bet;
  if (a === b || b === c) return Math.round(bet * 1.6);
  if (a === c) return Math.round(bet * 1.2);
  return 0;
}

export function computePayout3Lines(grid, bet) {
  // grid: [ [r0c0,r0c1,r0c2], [r1c0,...], [r2c0,...] ]
  const top = computePayoutLine([grid[0][0], grid[0][1], grid[0][2]], bet);
  const mid = computePayoutLine([grid[1][0], grid[1][1], grid[1][2]], bet);
  const bot = computePayoutLine([grid[2][0], grid[2][1], grid[2][2]], bet);
  const diagDown = computePayoutLine([grid[0][0], grid[1][1], grid[2][2]], bet); // ↘
  const diagUp = computePayoutLine([grid[2][0], grid[1][1], grid[0][2]], bet); // ↗
  return { total: top + mid + bot + diagDown + diagUp, breakdown: { top, mid, bot, diagDown, diagUp } };
}

export function randomReels() {
  return [rollSymbolIndex(), rollSymbolIndex(), rollSymbolIndex()];
}



