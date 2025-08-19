import { el } from '../utils.js';

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
  frag.appendChild(sec);
  return frag;
}


