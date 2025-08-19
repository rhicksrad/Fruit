import { el, fmt, announce } from '../utils.js';
import { state } from '../state.js';
import { Symbols, randomReels, computePayout } from '../slot.js';
import { sClick, sSpin, sHold, sWin, sLose, setSoundEnabled } from '../sound.js';

function symbolEmoji(idx) {
  return Symbols[idx].emoji;
}

function ensureCoins(min) {
  if (state.coins < min) {
    state.coins += 50; // small gift to keep it fun
  }
}

export function viewGame() {
  setSoundEnabled(state.settings.sound);

  let reels = randomReels();
  const held = [...state.reelsHold];
  let spinning = false;

  function renderReels() {
    reelEls.forEach((r, i) => {
      r.querySelector('.symbol').textContent = symbolEmoji(reels[i]);
      r.dataset.hold = String(held[i]);
    });
  }

  function updateUI() {
    betValue.textContent = String(state.bet);
    coinDisplay.textContent = fmt(state.coins);
    spinBtn.disabled = spinning || state.coins < state.bet;
  }

  function applyAchievementChecks(win) {
    if (!state.achievements.firstSpin && state.spins >= 1) state.achievements.firstSpin = true;
    if (!state.achievements.hundredSpins && state.spins >= 100) state.achievements.hundredSpins = true;
    if (!state.achievements.bigWin50 && win >= 50) state.achievements.bigWin50 = true;
    // jackpot: any triple
    if (!state.achievements.jackpot && (reels[0] === reels[1] && reels[1] === reels[2])) state.achievements.jackpot = true;
    if (!state.achievements.brokeAndBack && state.coins <= 0) state.achievements.brokeAndBack = true;
  }

  function spin() {
    if (spinning) return;
    if (state.coins < state.bet) return;
    spinning = true;
    state.spins += 1;
    state.coins -= state.bet;
    sSpin();
    updateUI();
    announce('Spinning');

    const duration = state.settings.quickSpin ? 350 : 1000;
    reelEls.forEach((r, i) => {
      r.classList.add('spinning');
      if (!held[i]) reels[i] = randomReels()[i];
    });
    renderReels();

    setTimeout(() => {
      reelEls.forEach((r) => r.classList.remove('spinning'));
      const win = computePayout(reels, state.bet);
      if (win > 0) {
        state.coins += win;
        state.bestWin = Math.max(state.bestWin, win);
        sWin();
        message.textContent = `You won ${fmt(win)}!`;
        announce('Win');
      } else {
        sLose();
        message.textContent = 'No win — try again!';
      }
      applyAchievementChecks(win);
      held.fill(false);
      state.reelsHold = [...held];
      renderReels();
      ensureCoins(state.bet);
      updateUI();
      spinning = false;
    }, duration);
  }

  function toggleHold(i) {
    if (spinning) return;
    held[i] = !held[i];
    state.reelsHold = [...held];
    sHold();
    renderReels();
  }

  function changeBet(delta) {
    const next = Math.max(1, Math.min(50, state.bet + delta));
    state.bet = next;
    sClick();
    updateUI();
  }

  const machine = el('section', { class: 'slot-machine' });
  const reelsRow = el('div', { class: 'reels' });
  const reelEls = [0, 1, 2].map((i) => {
    const r = el('div', { class: 'reel', 'data-hold': String(held[i]) }, [
      el('div', { class: 'symbol', style: 'will-change: transform' }, [symbolEmoji(reels[i])]),
      el('button', { class: 'hold-toggle', title: 'Hold this reel' }, ['HOLD'])
    ]);
    r.querySelector('.hold-toggle').addEventListener('click', () => toggleHold(i));
    reelsRow.appendChild(r);
    return r;
  });
  machine.appendChild(reelsRow);

  const controls = el('div', { class: 'controls' });
  const left = el('div', { class: 'left-controls' });
  const right = el('div', { class: 'right-controls' });

  const spinBtn = el('button', { class: 'btn btn-primary' }, ['Spin (Space)']);
  spinBtn.addEventListener('click', spin);
  left.appendChild(spinBtn);

  const betDown = el('button', { class: 'btn btn-ghost', title: 'Decrease bet' }, ['-']);
  const betUp = el('button', { class: 'btn btn-ghost', title: 'Increase bet' }, ['+']);
  const betValue = el('span', { class: 'bet-value' }, [String(state.bet)]);
  const coinDisplay = el('span', {}, [fmt(state.coins)]);
  betDown.addEventListener('click', () => changeBet(-1));
  betUp.addEventListener('click', () => changeBet(+1));

  right.appendChild(el('div', { class: 'bet' }, ['Bet: ', betDown, betValue, betUp]));
  right.appendChild(el('div', { class: 'bet' }, ['Coins: ', coinDisplay]));
  machine.appendChild(controls);
  controls.appendChild(left);
  controls.appendChild(right);

  const payout = el('div', { class: 'payout' }, [
    'Payouts: ',
    '3x 🍒x', String(Symbols.find(s => s.key === 'cherry').payout), ', ',
    '3x 7️⃣x', String(Symbols.find(s => s.key === 'seven').payout), ' … pairs pay 1.6x, diagonal pairs 1.2x',
  ]);
  machine.appendChild(payout);

  const message = el('div', { class: 'message' }, ['Good luck!']);
  machine.appendChild(message);

  renderReels();
  updateUI();

  const keyHandler = (e) => {
    if (e.repeat) return;
    if (e.code === 'Space') {
      e.preventDefault();
      spin();
    } else if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      toggleHold(0);
    } else if (/^[1-9]$/.test(e.key)) {
      const digit = Number(e.key);
      state.bet = Math.max(1, Math.min(50, digit));
      updateUI();
    }
  };
  window.addEventListener('keydown', keyHandler);

  // Clean up when view is detached
  machine.addEventListener('detach', () => {
    window.removeEventListener('keydown', keyHandler);
  });

  return machine;
}


