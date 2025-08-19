import { el, fmt, announce } from '../utils.js';
import { state } from '../state.js';
import { Symbols, randomReels, computePayout3Lines } from '../slot.js';
import { sClick, sSpin, sWin, sLose, setSoundEnabled } from '../sound.js';

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
  let spinning = false;

  const TILE_H = 96;
  const WIN_H = 288; // show 3 tiles
  const CENTER_OFFSET = (WIN_H / 2) - (TILE_H / 2);
  const CYCLES = 50;

  function buildStripElement(initialSymbolIndex) {
    const strip = el('div', { class: 'strip' });
    for (let c = 0; c < CYCLES; c++) {
      Symbols.forEach((s) => strip.appendChild(el('div', { class: 'symbol-tile' }, [s.emoji])));
    }
    const initialCycle = Math.floor(CYCLES / 2);
    const absIndex = initialCycle * Symbols.length + (initialSymbolIndex % Symbols.length);
    strip.dataset.indexAbs = String(absIndex);
    const translate = -(absIndex * TILE_H - CENTER_OFFSET);
    strip.style.transform = `translateY(${translate}px)`;
    return strip;
  }

  function renderReels() {
    reelEls.forEach((r, i) => {
      const strip = r.querySelector('.strip');
      const absIndex = Number(strip.dataset.indexAbs || '0');
      const translate = -(absIndex * TILE_H - CENTER_OFFSET);
      strip.style.transition = 'none';
      strip.style.transform = `translateY(${translate}px)`;
      void strip.offsetHeight; // reflow
      strip.style.transition = '';
    });
  }

  function updateUI() {
    betValue.textContent = String(state.bet);
    coinDisplay.textContent = fmt(state.coins);
    if (arm) {
      const locked = spinning || state.coins < state.bet;
      arm.classList.toggle('locked', locked);
    }
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
    // Normalize strips to middle cycle to avoid overflow
    const middleCycle = Math.floor(CYCLES / 2);
    reelEls.forEach((r) => {
      const strip = r.querySelector('.strip');
      const currentAbsRaw = Number(strip.dataset.indexAbs || '0');
      const currentMod = ((currentAbsRaw % Symbols.length) + Symbols.length) % Symbols.length;
      const centerAbs = middleCycle * Symbols.length + currentMod;
      strip.dataset.indexAbs = String(centerAbs);
      const snap = -(centerAbs * TILE_H - CENTER_OFFSET);
      strip.style.transition = 'none';
      strip.style.transform = `translateY(${snap}px)`;
      void strip.offsetHeight; // reflow to apply without animation
      strip.style.transition = '';
    });
    const newRoll = randomReels();
    const baseDur = state.settings.quickSpin ? 600 : 1600;
    reelEls.forEach((r, i) => {
      r.classList.add('spinning');
      const strip = r.querySelector('.strip');
      const currentAbs = Number(strip.dataset.indexAbs || '0');
      const currentMod = ((currentAbs % Symbols.length) + Symbols.length) % Symbols.length;
      const targetSymbol = newRoll[i];
      const extraCycles = 4 + i * 2; // 4,6,8
      const deltaSymbol = (Symbols.length + targetSymbol - currentMod) % Symbols.length;
      const nextAbs = currentAbs + extraCycles * Symbols.length + deltaSymbol;
      const translate = -(nextAbs * TILE_H - CENTER_OFFSET);
      strip.dataset.indexAbs = String(nextAbs);
      strip.style.transition = `transform ${baseDur + i * 260}ms cubic-bezier(.09,.79,.21,1)`;
      strip.style.transform = `translateY(${translate}px)`;
      reels[i] = targetSymbol;
    });

    const settleTime = (state.settings.quickSpin ? 600 : 1600) + 2 * 260;
    setTimeout(() => {
      reelEls.forEach((r) => r.classList.remove('spinning'));
      // Construct a 3x3 grid using the center index (mid row) and adjacent symbols for top/bottom
      const wrap = (n) => ((n % Symbols.length) + Symbols.length) % Symbols.length;
      const grid = [
        [ wrap(reels[0] - 1), wrap(reels[1] - 1), wrap(reels[2] - 1) ],
        [ reels[0], reels[1], reels[2] ],
        [ wrap(reels[0] + 1), wrap(reels[1] + 1), wrap(reels[2] + 1) ],
      ];
      const result = computePayout3Lines(grid, state.bet);
      const win = result.total;
      if (win > 0) {
        state.coins += win;
        state.bestWin = Math.max(state.bestWin, win);
        sWin();
        const parts = [];
        if (result.breakdown.top) parts.push(`Top: ${fmt(result.breakdown.top)}`);
        if (result.breakdown.mid) parts.push(`Middle: ${fmt(result.breakdown.mid)}`);
        if (result.breakdown.bot) parts.push(`Bottom: ${fmt(result.breakdown.bot)}`);
        message.textContent = `You won ${fmt(win)}! ${parts.length ? '(' + parts.join(', ') + ')' : ''}`;
        machine.classList.add('flash-win');
        setTimeout(() => machine.classList.remove('flash-win'), 800);
        announce('Win');
        const rowsOn = [!!result.breakdown.top, !!result.breakdown.mid, !!result.breakdown.bot];
        reelEls.forEach((reel) => {
          const glows = reel.querySelectorAll('.row-glow');
          if (glows.length === 3) {
            glows[0].classList.toggle('on', rowsOn[0]);
            glows[1].classList.toggle('on', rowsOn[1]);
            glows[2].classList.toggle('on', rowsOn[2]);
          }
        });
        // Measure and align diagonal lines dynamically
        const rect = reelsRow.getBoundingClientRect();
        const width = rect.width;
        const angle = Math.atan((2 * TILE_H) / width) * (180 / Math.PI); // rise over run across three columns
        diagDown.style.transform = `rotate(${angle}deg)`;
        diagUp.style.transform = `rotate(${-angle}deg)`;
        diagDown.classList.toggle('on', !!result.breakdown.diagDown);
        diagUp.classList.toggle('on', !!result.breakdown.diagUp);
        setTimeout(() => {
          reelEls.forEach((r) => r.querySelectorAll('.row-glow.on').forEach((n) => n.classList.remove('on')));
          diagDown.classList.remove('on');
          diagUp.classList.remove('on');
        }, 1200);
      } else {
        sLose();
        message.textContent = 'No win — try again!';
      }
      applyAchievementChecks(win);
      ensureCoins(state.bet);
      spinning = false;
      updateUI();
    }, settleTime + 50);
  }

  function changeBet(delta) {
    const next = Math.max(10, Math.min(100, state.bet + delta));
    state.bet = next;
    sClick();
    updateUI();
  }

  const machine = el('section', { class: 'slot-machine' });
  const reelsRow = el('div', { class: 'reels marquee' });
  // Add animated marquee bulbs
  const topLights = el('div', { class: 'lights top' });
  const bottomLights = el('div', { class: 'lights bottom' });
  for (let i = 0; i < 36; i++) {
    const bulbTop = el('span', { class: `bulb ${i % 2 ? 'alt' : ''}`, style: `--i:${i}` });
    const bulbBottom = el('span', { class: `bulb ${i % 2 ? 'alt' : ''}`, style: `--i:${i}` });
    topLights.appendChild(bulbTop);
    bottomLights.appendChild(bulbBottom);
  }
  const reelEls = [0, 1, 2].map((i) => {
    const r = el('div', { class: 'reel' });
    const windowEl = el('div', { class: 'reel-window' });
    const strip = buildStripElement(reels[i]);
    windowEl.appendChild(strip);
    r.appendChild(windowEl);
    r.appendChild(el('div', { class: 'reel-highlight' }));
    r.appendChild(el('div', { class: 'reel-guides' }));
    const topGlow = el('div', { class: 'row-glow', style: 'top: 48px;' });
    const midGlow = el('div', { class: 'row-glow', style: 'top: 144px;' });
    const botGlow = el('div', { class: 'row-glow', style: 'top: 240px;' });
    r.appendChild(topGlow);
    r.appendChild(midGlow);
    r.appendChild(botGlow);
    reelsRow.appendChild(r);
    return r;
  });
  machine.appendChild(reelsRow);
  reelsRow.appendChild(topLights);
  reelsRow.appendChild(bottomLights);
  const diagDown = el('div', { class: 'diag-line diag-down' });
  const diagUp = el('div', { class: 'diag-line diag-up' });
  const diag = el('div', { class: 'diag-overlay' }, [diagDown, diagUp]);
  machine.appendChild(diag);

  const controls = el('div', { class: 'controls' });
  const left = el('div', { class: 'left-controls' });
  const right = el('div', { class: 'right-controls' });

  // Lever arm for spin
  let arm = el('button', { class: 'arm', title: 'Pull to spin' });
  arm.appendChild(el('div', { class: 'socket' }));
  arm.appendChild(el('div', { class: 'track' }));
  arm.appendChild(el('div', { class: 'stick' }));
  arm.appendChild(el('div', { class: 'knob' }));
  const onPointerDown = () => {
    if (arm.classList.contains('locked')) return;
    arm.classList.add('pulling');
  };
  const onPointerUp = () => {
    if (spinning) return; // safety: don't trigger multiple spins
    if (!arm.classList.contains('pulling')) return;
    arm.classList.remove('pulling');
    spin();
  };
  arm.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  machine.appendChild(arm);

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
    } else if (/^[1-9]$/.test(e.key)) {
      const digit = Number(e.key) * 10; // map 1..9 to 10..90
      state.bet = Math.max(10, Math.min(100, digit));
      updateUI();
    }
  };
  window.addEventListener('keydown', keyHandler);

  // Clean up when view is detached
  machine.addEventListener('detach', () => {
    window.removeEventListener('keydown', keyHandler);
    window.removeEventListener('pointerup', onPointerUp);
  });

  return machine;
}


