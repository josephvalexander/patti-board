# 🃏 Pattiboard

A Progressive Web App (PWA) to track scores for Indian Rummy — up to 10 players, bust limits, reentry support. All data is stored locally on each user's device.

---

## Files

```
index.html      ← The entire app
manifest.json   ← PWA metadata (name, icon, colors)
sw.js           ← Service worker (offline support)
icon-192.png    ← App icon (home screen)
icon-512.png    ← App icon (splash screen)
```

---

## Deploy to GitHub Pages (Free Hosting)

### Step 1 — Create a GitHub account
Go to [github.com](https://github.com) and sign up (free).

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `pattiboard`
3. Set visibility to **Public**
4. Click **Create repository**

### Step 3 — Upload the files
1. On your new repo page, click **uploading an existing file**
2. Drag and drop all 5 files:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
3. Scroll down, click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Go to your repo → **Settings** tab
2. Scroll down to **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Branch: `main`, Folder: `/ (root)`
5. Click **Save**

### Step 5 — Get your URL
Wait ~1 minute, then refresh the Settings → Pages page.
Your app will be live at:
```
https://YOUR_GITHUB_USERNAME.github.io/pattiboard
```

---

## Share with Players

Send everyone the URL. On their phone:

**Android (Chrome):**
> Menu (⋮) → "Add to Home Screen" → Install

**iPhone (Safari):**
> Share button (□↑) → "Add to Home Screen" → Add

Each player gets their own app icon. All game data is stored **only on their device** — nothing is sent to any server.

---

## Features

- Track up to 10 players per game
- 🏆 Winner button (auto 0 points)
- 💥 Bust button (auto round-bust points)
- Configurable round bust, game bust, and reentry thresholds per game
- Automatic player elimination when game bust limit exceeded
- Reentry when next highest active score ≤ reentry threshold
- Undo last round
- 30-day game history with auto-cleanup
- Copy players from a previous game
- Works fully offline after first load

---

## Updating the App Later

To update the app after making changes:
1. Open your repo on GitHub
2. Click on the file you want to update (e.g. `index.html`)
3. Click the **pencil icon** (Edit)
4. Paste the new content
5. Click **Commit changes**

GitHub Pages will auto-deploy within a minute.
