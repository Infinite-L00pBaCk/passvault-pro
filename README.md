# 🔐 PassVault Pro

A secure, offline-first password manager built with vanilla HTML, CSS, and JavaScript. No backend, no dependencies, no cloud — everything runs in your browser.

## Features

- 🔑 **Local accounts** — username + password and/or 4-digit PIN login
- 🎲 **Password Generator** — Random, Passphrase, and Manual modes
- 🗄️ **Encrypted vault** — per-user password storage, SHA-256 hashed credentials
- 🛡️ **Health Audit** — detects weak, reused, and aging passwords
- 📤 **Export** — JSON and CSV formats
- 📥 **Import** — restore from JSON backup
- 🔍 **Search, sort, and filter** by category
- 💻 **Works offline** — no internet required after first load

## Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML structure |
| `style.css` | All styles (cyberpunk dark theme) |
| `app.js` | All JavaScript logic |
| `README.md` | This file |

## Usage

Just open `index.html` in any modern browser. No server needed.

Or deploy to GitHub Pages:
1. Push this folder to a GitHub repo
2. Go to **Settings → Pages → Source: main**
3. Your app will be live at `https://yourusername.github.io/repo-name/`

## Tech Stack

- Vanilla HTML / CSS / JavaScript
- Web Crypto API (SHA-256 hashing)
- localStorage for data persistence
- Google Fonts (Space Mono + Syne)
