import { rngInt } from './utils.js';

export const Symbols = [
  // Common fruits (lower payouts, higher weights)
  { key: 'cherry', emoji: '🍒', weight: 18, payout: 10 },
  { key: 'lemon', emoji: '🍋', weight: 16, payout: 12 },
  { key: 'grape', emoji: '🍇', weight: 14, payout: 16 },
  { key: 'orange', emoji: '🍊', weight: 12, payout: 20 },
  { key: 'watermelon', emoji: '🍉', weight: 10, payout: 28 },
  { key: 'strawberry', emoji: '🍓', weight: 10, payout: 26 },
  { key: 'apple_red', emoji: '🍎', weight: 10, payout: 22 },
  { key: 'apple_green', emoji: '🍏', weight: 10, payout: 22 },
  { key: 'peach', emoji: '🍑', weight: 10, payout: 24 },
  { key: 'pear', emoji: '🍐', weight: 10, payout: 24 },
  { key: 'banana', emoji: '🍌', weight: 10, payout: 24 },
  { key: 'pineapple', emoji: '🍍', weight: 8, payout: 30 },
  { key: 'mango', emoji: '🥭', weight: 8, payout: 30 },
  { key: 'kiwi', emoji: '🥝', weight: 8, payout: 32 },
  { key: 'melon', emoji: '🍈', weight: 8, payout: 28 },
  { key: 'coconut', emoji: '🥥', weight: 6, payout: 36 },
  { key: 'tomato', emoji: '🍅', weight: 6, payout: 34 },
  { key: 'avocado', emoji: '🥑', weight: 6, payout: 36 },
  // Replaced newer, less-supported emojis with broadly supported ones
  { key: 'berries_alt', emoji: '🍇', weight: 6, payout: 34 },
  { key: 'olive_alt', emoji: '🍈', weight: 6, payout: 32 },

  // Slot-style icons (rarer, bigger payouts)
  { key: 'clover', emoji: '🍀', weight: 5, payout: 50 },
  { key: 'bell', emoji: '🔔', weight: 5, payout: 60 },
  { key: 'star', emoji: '⭐', weight: 4, payout: 80 },
  { key: 'diamond_blue', emoji: '🔷', weight: 4, payout: 90 },
  { key: 'gem', emoji: '💎', weight: 3, payout: 120 },
  { key: 'crown', emoji: '👑', weight: 2, payout: 180 },
  { key: 'moneybag', emoji: '💰', weight: 2, payout: 180 },
  { key: 'dice', emoji: '🎲', weight: 2, payout: 140 },
  { key: 'star2', emoji: '🌟', weight: 2, payout: 110 },
  { key: 'lollipop', emoji: '🍭', weight: 3, payout: 100 },
  { key: 'candy', emoji: '🍬', weight: 3, payout: 90 },
  { key: 'seven', emoji: '7️⃣', weight: 2, payout: 220 },
  { key: 'slot', emoji: '🎰', weight: 1, payout: 320 },
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



