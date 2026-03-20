
# 🔐 PassVault Pro

**PassVault Pro** is a sleek, secure, and offline-first password manager built with pure vanilla web technologies. Designed with a high-performance "Cyberpunk" dark aesthetic, it ensures your data never leaves your machine.

## 🚀 Live Demo

**[Deploy your own via GitHub Pages in seconds\!]**

-----

## ✨ Key Features

  * **Zero-Knowledge Architecture:** No backend, no databases, and no cloud syncing. All data is stored locally in your browser's `localStorage`.
  * **Dual Authentication:** Support for traditional Master Passwords or a quick 4-digit PIN login.
  * **Advanced Password Generator:** \* **Random:** Customizable length and character sets.
      * **Passphrase:** Readable, secure word-based passwords.
      * **Manual:** Audit your own custom passwords.
  * **Security Health Audit:** Real-time dashboard identifying weak, reused, or aging passwords (90+ days old).
  * **Smart Organization:** Search, sort by strength/date, and filter by category (Banking, Social, Work, etc.).
  * **Portable Data:** Export your vault to **JSON** (for backups) or **CSV** (for spreadsheets) and re-import anytime.

-----

## 🛠️ Tech Stack

  * **Frontend:** HTML5, CSS3 (Custom Variables, Flex/Grid), Vanilla JavaScript (ES6+).
  * **Security:** Web Crypto API (SHA-256) for credential hashing.
  * **Typography:** Syne & Space Mono via Google Fonts.
  * **Persistence:** Browser `localStorage`.

-----

## 📦 Installation & Deployment

Since this project has **zero dependencies**, deployment is trivial.

### Local Use

1.  Clone the repository: `git clone https://github.com/yourusername/passvault-pro.git`
2.  Open `index.html` in any modern web browser.

### GitHub Pages (Recommended)

1.  Push the code to your GitHub repository.
2.  Navigate to **Settings** \> **Pages**.
3.  Under **Build and deployment**, set the source to `Deploy from a branch` and select `main`.
4.  Your site will be live at `https://yourusername.github.io/passvault-pro/`.

-----

## 🔒 Security Note

This application uses the **Web Crypto API** to hash your login credentials, making them unreadable even if someone accesses your local storage. However, because data is stored in the browser's `localStorage`, clearing your browser cache/data will delete your vault.

**Always keep a JSON backup of your vault using the Export feature.**

-----

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

-----
