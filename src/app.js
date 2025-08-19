import { navigateTo, initRouter } from './router.js';
import { state, initState, subscribe } from './state.js';
import { primeSound } from './sound.js';
import { viewStart } from './views/start.js';
import { viewGame } from './views/game.js';
import { viewSettings } from './views/settings.js';
import { viewAchievements } from './views/achievements.js';
import { viewAbout } from './views/about.js';

const routes = {
  '/start': viewStart,
  '/game': viewGame,
  '/achievements': viewAchievements,
  '/settings': viewSettings,
  '/about': viewAbout,
};

function render(route) {
  const outlet = document.getElementById('app');
  const handler = routes[route] || routes['/start'];
  // lifecycle: dispatch detach to allow views to cleanup listeners
  const detachEvent = new Event('detach');
  Array.from(outlet.childNodes).forEach((n) => n.dispatchEvent && n.dispatchEvent(detachEvent));
  outlet.innerHTML = '';
  const fragment = handler();
  outlet.appendChild(fragment);
  updateNav(route);
  updateCoinDisplay();
  outlet.focus();
}

function updateNav(route) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((a) => {
    if (a.getAttribute('data-route') === `#${route}`) a.classList.add('active');
    else a.classList.remove('active');
  });
}

function updateCoinDisplay() {
  const coinAmount = document.getElementById('coinAmount');
  if (coinAmount) coinAmount.textContent = state.coins.toString();
}

function hydrateTheme() {
  document.body.classList.remove('theme-classic', 'theme-emerald', 'theme-neon', 'theme-midnight');
  document.body.classList.add(state.settings.theme);
}

function main() {
  initState();
  hydrateTheme();
  initRouter(render);

  subscribe(() => {
    updateCoinDisplay();
  });

  if (!location.hash) navigateTo('/start');
  else navigateTo(location.hash.replace('#', ''));

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.matches('[data-nav]')) {
      const route = target.getAttribute('data-nav');
      if (route) navigateTo(route);
    }
    primeSound();
  });

  // In case the user interacts via keyboard first (e.g., Space to spin)
  window.addEventListener('keydown', () => {
    primeSound();
  }, { once: false });

  // Also prime on first pointer interaction (mouse/touch/pen)
  window.addEventListener('pointerdown', () => {
    primeSound();
  }, { once: false });

  window.addEventListener('storage', (event) => {
    if (event.key === 'fruitmachine_state') {
      try {
        const next = JSON.parse(String(event.newValue || '{}'));
        Object.assign(state, next);
        hydrateTheme();
        updateCoinDisplay();
      } catch {}
    }
  });
}

window.addEventListener('DOMContentLoaded', main);


