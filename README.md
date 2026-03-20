## 🔐 PassVault Pro

**PassVault Pro** is a high-performance, offline-first password management solution designed with a "Cyberpunk" dark aesthetic. Built using pure vanilla web technologies like HTML, CSS, and JavaScript, it prioritizes user privacy by ensuring that sensitive data never leaves the local machine.

## 🚀 Live Demo

**[Access PassVault Pro on Vercel](https://passvault-pro.vercel.app/)**

-----

## ✨ Core Features

### 🔑 Robust Authentication

  * **Local Accounts:** Create personalized accounts with a unique username.
  * **Dual Login Methods:** Support for traditional master passwords or a quick-access 4-digit PIN.
  * **Secure Hashing:** All credentials (passwords and PINs) are processed using SHA-256 hashing via the Web Crypto API.
  * **Visual Personalization:** Each user profile is assigned a unique color chip based on their account.

### 🎲 Advanced Password Generation

  * **Random Mode:** Fully customizable generation with toggles for uppercase, lowercase, numbers, symbols, and an "Exclude Ambiguous" filter.
  * **Passphrase Mode:** Generates human-readable but cryptographically secure phrases using a built-in dictionary and customizable separators.
  * **Manual Mode:** Allows users to input and audit the strength of their own pre-existing passwords before saving them.
  * **Strength Indicator:** Real-time visual feedback ranging from "WEAK" to "STRONG" based on length and character complexity.

### 🛡️ Security Health Audit

  * **Real-Time Analysis:** A dedicated dashboard that monitors total, strong, weak, and reused passwords.
  * **Risk Detection:** Automatically flags weak passwords, reused credentials, and "aging" passwords that haven't been updated in over 90 days.
  * **Security Score:** Provides a numerical score (0-100) and a qualitative grade based on vault health.

### 🗄️ Vault Management

  * **Categorization:** Organize entries using icons for Web, Email, Banking, Gaming, Social, Shopping, Work, Cloud, Dev, Music, Health, and more.
  * **Smart Search & Sort:** Instantly filter entries by platform or username, and sort by date, name, or password strength.
  * **Metadata Tracking:** Automatically logs creation dates and allows for custom notes or 2FA backup codes for each entry.

-----

## 🛠️ Technical Architecture

  * **Frontend:** Built with vanilla HTML5, CSS3 (utilizing custom variables and grid layouts), and ES6+ JavaScript.
  * **Security Engine:** Leverages the `crypto.subtle` Web Crypto API for secure hashing and `crypto.getRandomValues` for cryptographically strong random number generation.
  * **Data Persistence:** Utilizes browser `localStorage` for per-user data isolation, meaning your vault is unique to the browser and device you are using.
  * **Zero Dependencies:** No external libraries, frameworks, or cloud backends are required.

-----

## 📥 Data Portability

  * **Export:** Backup your entire vault to a **JSON** file or export to **CSV** for use in spreadsheet applications.
  * **Import:** Restore your data from a JSON backup with a simple drag-and-drop or file-select interface.

-----

## 🔒 Security & Privacy Notice

Because PassVault Pro is **offline-first**, your data is only as safe as your device.

  * **No Cloud Recovery:** Since there is no backend, there is no "Forgot Password" feature; lost master credentials cannot be recovered.
  * **Cache Warning:** Clearing your browser's site data or cache will delete the `localStorage` where your vault is kept.
  * **Recommendation:** Regularly export your vault to a secure, encrypted JSON backup.

-----

## 📄 License

This project is licensed under the MIT License.

-----

**Made with ❤️ by [Priyam Prakash]**
