const defaultState = {
  coins: 100,
  bet: 10,
  spins: 0,
  bestWin: 0,
  achievements: {
    firstSpin: false,
    hundredSpins: false,
    bigWin50: false,
    jackpot: false,
    brokeAndBack: false,
  },
  settings: {
    sound: true,
    theme: 'theme-classic',
    quickSpin: false,
    highContrastSymbols: false,
  },
};

const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => {
    try { l(); } catch {}
  });
}

function persist(next) {
  try {
    const toSave = JSON.stringify(next);
    localStorage.setItem('fruitmachine_state', toSave);
  } catch {}
}

const INTERNAL = Symbol('obs');

function makeObservable(obj, onChange) {
  if (!obj || typeof obj !== 'object' || obj[INTERNAL]) return obj;
  Object.defineProperty(obj, INTERNAL, { value: true, enumerable: false });
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (value && typeof value === 'object') return makeObservable(value, onChange);
      return value;
    },
    set(target, prop, value) {
      const nextValue = value && typeof value === 'object' ? makeObservable(value, onChange) : value;
      const result = Reflect.set(target, prop, nextValue);
      onChange();
      return result;
    },
    deleteProperty(target, prop) {
      const result = Reflect.deleteProperty(target, prop);
      onChange();
      return result;
    }
  });
}

export let state = makeObservable(structuredClone(defaultState), () => {
  persist(state);
  notify();
});

export function initState() {
  try {
    const saved = localStorage.getItem('fruitmachine_state');
    const merged = saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    state = makeObservable(structuredClone(merged), () => {
      persist(state);
      notify();
    });
    persist(state);
    notify();
  } catch {
    // ignore
  }
}

export function resetProgress() {
  state = makeObservable(structuredClone(defaultState), () => {
    persist(state);
    notify();
  });
  persist(state);
  notify();
}


