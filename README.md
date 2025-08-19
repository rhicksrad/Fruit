# Fruit Machine 🎰

A colorful, classic-style 3‑reel Fruit Machine for fun coins. Includes Start, Game, Achievements, Settings, and About pages. Zero‑dependency SPA, ideal for GitHub Pages.

## Features

- Classic 3 reels with weighted fruit symbols and payouts
- Quick spin, adjustable bet (10–100)
- Fun coin economy only (no real money)
- Achievements: first spin, 100 spins, big win, jackpot, comeback
- Themes (Classic, Emerald, Neon, Midnight), Web Audio sounds
- Keyboard: Space (spin), 1–9 (set bet ×10)

## Run Locally

Open `index.html` in a modern browser or serve the folder:

```powershell
python -m http.server 5173
# visit http://localhost:5173
```

## Deploy to GitHub Pages

Settings → Pages → Build from branch → Branch: `main`, Folder: `/ (root)`

## Structure

```
index.html
assets/styles.css
src/
  app.js
  router.js
  state.js
  utils.js
  sound.js
  slot.js
  views/
    start.js
    game.js
    achievements.js
    settings.js
    about.js
```

## License

MIT — see `LICENSE`.
