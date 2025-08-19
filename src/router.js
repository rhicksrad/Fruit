let onRoute = () => {};

export function initRouter(render) {
  onRoute = render;
  window.addEventListener('hashchange', () => {
    const route = location.hash.replace('#', '') || '/start';
    onRoute(route);
  });
}

export function navigateTo(route) {
  const normalized = route.startsWith('/') ? route : `/${route}`;
  const targetHash = `#${normalized}`;
  if (location.hash !== targetHash) {
    location.hash = targetHash;
  } else {
    onRoute(normalized);
  }
}


