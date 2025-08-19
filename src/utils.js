export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v === false || v === null || v === undefined) {}
    else if (k === 'dataset') {
      Object.entries(v).forEach(([dk, dv]) => {
        node.dataset[dk] = String(dv);
      });
    } else if (k === 'html') node.innerHTML = String(v);
    else node.setAttribute(k, String(v));
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined || c === false) return;
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  });
  return node;
}

export function fmt(num) {
  return new Intl.NumberFormat().format(num);
}

export function rngInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(n, max));
}

export function announce(message) {
  const live = document.getElementById('aria-live');
  if (!live) return;
  live.textContent = '';
  setTimeout(() => (live.textContent = message), 20);
}


