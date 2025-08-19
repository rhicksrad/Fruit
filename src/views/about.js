import { el } from '../utils.js';
import { Symbols } from '../slot.js';

export function viewAbout() {
  const frag = document.createDocumentFragment();
  const sec = el('section', { class: 'card' });
  sec.appendChild(el('h2', {}, ['About Fruit Machine']));
  sec.appendChild(el('p', {}, [
    'Fruit Machine is a classic-style 3-reel slot for the web — designed for fun with colorful fruit symbols and juicy wins. No real money is involved, and no prizes are offered. Built as a single-page app ideal for hosting on GitHub Pages.'
  ]));
  sec.appendChild(el('p', {}, [
    'Tech: plain HTML/CSS/JS with a tiny router and persistent state via localStorage. All assets are embedded for instant deploy.'
  ]));
  sec.appendChild(el('p', {}, [
    'Accessibility: keyboard shortcuts, focus management, and polite ARIA live announcements on result messages.'
  ]));
  sec.appendChild(el('p', {}, [
    'Credits: emojis via Unicode, sound via Web Audio API.'
  ]));

  const payoutSec = el('section', { class: 'card', style: 'margin-top:12px' });
  payoutSec.appendChild(el('h3', {}, ['Payouts']));
  const list = el('div', { class: 'grid' });
  Symbols.forEach((s) => {
    list.appendChild(
      el('div', { class: 'badge' }, [
        el('div', { class: 'icon' }, [s.emoji]),
        el('div', {}, [
          el('div', { style: 'font-weight:900' }, [`3x ${s.emoji}`]),
          el('div', { class: 'muted' }, [`Pays ${s.payout}x bet`])
        ])
      ])
    );
  });
  payoutSec.appendChild(list);
  frag.appendChild(payoutSec);

  const pairs = el('section', { class: 'card', style: 'margin-top:12px' });
  pairs.appendChild(el('h3', {}, ['Other payouts']))
  pairs.appendChild(el('ul', {}, [
    el('li', {}, ['Any adjacent pair pays 1.6x bet']),
    el('li', {}, ['Outer pair (first and third reel) pays 1.2x bet']),
    el('li', { class: 'muted' }, ['Triples pay as listed above (symbol multiplier × bet).'])
  ]));
  frag.appendChild(pairs);
  frag.appendChild(sec);
  return frag;
}


