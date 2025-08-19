import { el } from '../utils.js';
import { state } from '../state.js';

const ACHS = [
  { key: 'firstSpin', icon: '🎯', title: 'First Spin', desc: 'Complete your first spin.' },
  { key: 'hundredSpins', icon: '💫', title: 'Centurion', desc: 'Complete 100 spins.' },
  { key: 'bigWin50', icon: '💎', title: 'High Roller', desc: 'Win 50+ coins in one spin.' },
  { key: 'jackpot', icon: '🏆', title: 'Lucky Seven', desc: 'Hit any triple for a big jackpot.' },
  { key: 'brokeAndBack', icon: '🪙', title: 'Comeback Kid', desc: 'Hit 0 coins (we spot you 50 to keep going).'},
];

export function viewAchievements() {
  const frag = document.createDocumentFragment();
  const wrap = el('section', {});
  wrap.appendChild(el('h2', {}, ['Achievements']));

  const grid = el('div', { class: 'grid' });
  ACHS.forEach((meta) => {
    const unlocked = !!state.achievements[meta.key];
    const card = el('div', { class: `badge ${unlocked ? '' : 'locked'}` }, [
      el('div', { class: 'icon' }, [meta.icon]),
      el('div', {}, [
        el('div', { style: 'font-weight:900' }, [meta.title]),
        el('div', { style: 'color:var(--muted)' }, [meta.desc]),
      ]),
    ]);
    grid.appendChild(card);
  });

  wrap.appendChild(grid);
  frag.appendChild(wrap);
  return frag;
}


