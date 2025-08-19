import { el } from '../utils.js';
import { navigateTo } from '../router.js';
import { state } from '../state.js';

export function viewStart() {
  const frag = document.createDocumentFragment();

  const hero = el('section', { class: 'hero' }, [
    el('div', { class: 'hero-card' }, [
      el('h1', {}, ['Fruit Machine 🎰']),
      el('p', { class: 'lead' }, ['Spin the reels, earn fun coins, and unlock achievements. No real money — just classic slot vibes with modern polish.']),
      el('div', { class: 'kbd-row', style: 'margin: 12px 0' }, [
        el('span', { class: 'kbd' }, ['Space']),
        ' Spin',
        el('span', { class: 'kbd' }, ['1–9']),
        ' Bet size (x10)',
      ]),
      el('div', { class: 'left-controls' }, [
        el('button', { class: 'btn btn-primary', 'data-nav': '/game' }, ['Start Playing']),
        el('button', { class: 'btn btn-ghost', 'data-nav': '/about' }, ['Learn More']),
      ]),
    ]),
    el('div', { class: 'hero-visual' }, [
      el('div', { class: 'slot-machine' }, [
        el('div', { class: 'reels' }, [
          el('div', { class: 'reel' }, [el('div', { class: 'symbol' }, ['🍒'])]),
          el('div', { class: 'reel' }, [el('div', { class: 'symbol' }, ['🍋'])]),
          el('div', { class: 'reel' }, [el('div', { class: 'symbol' }, ['🍇'])]),
        ]),
        el('div', { class: 'controls' }, [
          el('div', { class: 'left-controls' }, [
            el('button', { class: 'btn btn-accent', 'data-nav': '/game' }, ['Spin Now']),
          ]),
          el('div', { class: 'right-controls' }, [
            el('div', { class: 'bet' }, ['Starting Coins: ', String(state.coins)]),
          ]),
        ]),
      ]),
    ]),
  ]);

  frag.appendChild(hero);

  const panels = el('section', { class: 'grid', style: 'margin-top: 20px' }, [
    el('div', { class: 'card' }, [
      el('h3', {}, ['How to play']),
      el('p', { class: 'muted' }, ['Set your bet, spin the reels, and aim for matching symbols. Earn more coins to unlock achievements.'] ),
    ]),
    el('div', { class: 'card' }, [
      el('h3', {}, ['No stakes, all fun']),
      el('p', {}, ['This is for fun only. Coins are not real money, and there is no gambling or prizes.']),
    ]),
    el('div', { class: 'card' }, [
      el('h3', {}, ['Make it yours']),
      el('p', {}, ['Visit Settings to change theme, toggle sound, and enable quick spins.']),
    ]),
  ]);
  frag.appendChild(panels);
  return frag;
}


