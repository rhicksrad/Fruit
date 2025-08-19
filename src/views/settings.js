import { el } from '../utils.js';
import { state, resetProgress } from '../state.js';
import { setSoundEnabled } from '../sound.js';

export function viewSettings() {
  const frag = document.createDocumentFragment();

  function updateTheme(theme) {
    state.settings.theme = theme;
    document.body.classList.remove('theme-classic', 'theme-emerald', 'theme-neon', 'theme-midnight');
    document.body.classList.add(theme);
  }

  const section = el('section', { class: 'settings card' });
  section.appendChild(el('h2', {}, ['Settings']));

  const form = el('div', { class: 'form' });

  const soundToggle = el('input', { type: 'checkbox', checked: state.settings.sound ? 'checked' : null });
  soundToggle.addEventListener('change', () => {
    state.settings.sound = !!soundToggle.checked;
    setSoundEnabled(state.settings.sound);
  });
  form.appendChild(el('div', { class: 'form-group' }, [
    el('label', {}, ['Sound effects']), soundToggle
  ]));

  const quickSpin = el('input', { type: 'checkbox', checked: state.settings.quickSpin ? 'checked' : null });
  quickSpin.addEventListener('change', () => {
    state.settings.quickSpin = !!quickSpin.checked;
  });
  form.appendChild(el('div', { class: 'form-group' }, [
    el('label', {}, ['Quick spin']), quickSpin
  ]));

  const themeSelect = el('select');
  [
    ['theme-classic', 'Classic Rose'],
    ['theme-emerald', 'Emerald Mint'],
    ['theme-neon', 'Neon Pop'],
    ['theme-midnight', 'Midnight Sky'],
  ].forEach(([val, label]) => {
    const opt = el('option', { value: val, selected: state.settings.theme === val ? 'selected' : null }, [label]);
    themeSelect.appendChild(opt);
  });
  themeSelect.addEventListener('change', () => updateTheme(themeSelect.value));
  form.appendChild(el('div', { class: 'form-group' }, [
    el('label', {}, ['Theme']), themeSelect
  ]));

  const resetBtn = el('button', { class: 'btn btn-ghost', style: 'margin-top:8px' }, ['Reset progress']);
  resetBtn.addEventListener('click', () => {
    if (confirm('Reset coins, spins, best win, holds and achievements?')) resetProgress();
  });

  section.appendChild(form);
  section.appendChild(resetBtn);
  frag.appendChild(section);
  return frag;
}



