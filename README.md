# PostMall Web App

**Nairobi's Social Commerce Platform** — React single-page app with live Lana AI.

## What's inside

```
postmall-web/
├── public/
│   ├── index.html       ← HTML shell
│   └── manifest.json    ← PWA config
├── src/
│   ├── App.jsx          ← Entire app (Splash → Login → Feed → Search → AI → Profile)
│   └── index.js         ← ReactDOM entry point
├── package.json
├── .gitignore
└── README.md
```

## Quick Start

```bash
# 1. Install
npm install

# 2. Run
npm start
# Opens at http://localhost:3000
```

That's it — no extra config needed. The app runs fully on mock data out of the box.

## Screens

| Screen | How to reach |
|--------|-------------|
| Splash | Auto on load |
| Login / Register | After splash |
| Home Feed | Bottom nav 🏠 |
| Search & Filter | Bottom nav 🔍 |
| Lana AI Chat | Bottom nav ✨ |
| Profile | Bottom nav 👤 |
| Store Profile | Tap any store name in the feed |
| Settings | Profile → ☰ → Settings |
| Create Merchandise Account | Profile → ☰ → Create Merchandise Account |
| Edit Profile | Profile → Edit Profile |

## Lana AI

Lana calls the Anthropic API directly from the browser using the `anthropic-dangerous-direct-browser-access` header.
This is fine for prototyping. **Before production**, proxy the call through your backend:

```js
// Replace the direct fetch in LanaAI() with:
const res = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ messages }),
});
const { reply } = await res.json();
```

## Connect to Real Backend

```bash
# Create a .env file:
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Then restart:
npm start
```

## Deploy to Vercel

```bash
# Push to GitHub, then:
# 1. Go to vercel.com → New Project → Import this repo
# 2. Add REACT_APP_API_URL env variable
# 3. Deploy — done in ~2 minutes
```

## Tech

- React 18 + hooks only (no router, no Redux — single-file simplicity)
- Zero external UI libraries — pure inline styles
- Fonts: Plus Jakarta Sans + Outfit (Google Fonts)
- Images: Unsplash (no API key needed)
