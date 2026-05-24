<div align="center">
  <img src="public/favicon.svg" alt="PassVault Pro Logo" width="120" height="120" />

  # PassVault Pro
  **The Ultimate Offline-First, Zero-Knowledge Password Manager**

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" /></a>
  </p>

  <p align="center">
    <strong><a href="#features">Features</a></strong> |
    <strong><a href="#architecture">Architecture</a></strong> |
    <strong><a href="#installation">Installation</a></strong> |
    <strong><a href="#security">Security</a></strong>
  </p>
</div>

---

## ⚡ Overview

**PassVault Pro** is a modern, ultra-secure, completely offline password manager built for users who prioritize privacy without sacrificing aesthetics. Unlike cloud-based solutions (like LastPass or Bitwarden) that are susceptible to server breaches, PassVault Pro runs entirely within your local browser ecosystem utilizing a **Zero-Knowledge Architecture**.

Designed with a stunning, premium **3D Glassmorphism UI**, fluid micro-animations, and military-grade cryptography, it brings a Silicon Valley enterprise feel to local personal security.

---

## 🚀 Key Features

*   **🔒 Zero-Knowledge Architecture:** Your data never leaves your device. No cloud servers, no databases, no external API calls. Everything is processed and encrypted locally.
*   **🛡️ Military-Grade Encryption:** Utilizes the native browser **Web Crypto API**. Your Master Password is mathematically hashed using `SHA-256` to create an unbreakable local encryption key.
*   **🎨 Ultra-Premium UI:** Built with custom Tailwind CSS utilities and Framer Motion to deliver a gorgeous frosted-glass aesthetic with smooth, cinematic transitions.
*   **📱 Progressive Web App (PWA):** Install PassVault Pro directly to your iOS or Android home screen for a seamless, native-app experience that works entirely offline.
*   **🎲 Advanced Password Generator:** Instantly generate cryptographically secure random passwords or human-readable passphrases with a built-in entropy strength analyzer.
*   **📊 Security Health Audit:** Automatically scans your local vault to flag reused, weak, or aging passwords to ensure your digital security hygiene remains flawless.
*   **🔑 Dual-Authentication:** Secure your vault with an unbreakable Master Password, and unlock it quickly during active sessions using a convenient 4-digit PIN.

---

## 🛠️ Tech Stack

PassVault Pro is built on a modern, lightning-fast frontend stack:

*   **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/) (blazing fast HMR)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (with custom glassmorphic tokens) + Vanilla CSS
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Storage:** LocalStorage / IndexedDB (Fully Offline)

---

## 💻 Installation & Setup

Because PassVault Pro has no backend dependencies, running it locally is incredibly simple.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   npm or yarn

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Infinite-L00pBack/passvault-pro.git
   cd passvault-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔐 Security Notice

PassVault Pro is designed with the philosophy that **you are the sole owner of your data**. 

Because of our Zero-Knowledge architecture, **we cannot recover a lost Master Password.** If you lose your Master Password, your vault is mathematically impossible to decrypt. Please ensure you memorize your Master Password or store a physical backup in a secure location (such as a fireproof safe).

To backup your vault to a new device, utilize the built-in **JSON Export** feature from your dashboard, transfer the file via USB, and use the **Import** feature on your new device.

---

<div align="center">
  <p>Built with ❤️ and ironclad security.</p>
  <p><b>© 2026 PassVault Pro</b></p>
</div>
