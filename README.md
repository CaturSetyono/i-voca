# 🛠️ PhraseForge

**PhraseForge** is a gamified Progressive Web App (PWA) built with **Astro JS** and **Tailwind CSS v4** designed for daily natural phrase mastery. Transitioning from simple vocabulary memorization to real-world Indonesian <-> English phrase forging, PhraseForge incorporates daily active streaks and AI-powered phrase evaluation via OpenRouter.

---

## ✨ Core Features

- **🚀 English-First Experience**: Clean, intuitive English user interface tailored for daily phrase practice.
- **🔥 Daily Streak Engine**: Tracks consecutive active learning days with a dynamic vector **Fire SVG Icon**. Adding at least 1 phrase per day ignites and keeps your streak alive!
- **🤖 OpenRouter AI Synchronization**:
  - Model: `nvidia/nemotron-3-ultra-550b-a55b:free`.
  - Batch validates phrase pairs for translation accuracy, grammar, typos, and natural phrasing.
  - Quota: **3 Sync charges per day** (auto-recharges 1 charge every 8 hours).
  - Flags invalid phrases with actionable AI correction notes and applies a **-5 XP penalty** until corrected.
- **🎮 Claymorphic Gamification**:
  - **XP & Level System**: Earn +10 XP per forged phrase and level up every 100 XP.
  - **Achievement Badges**: Unlock milestone badges (Novice Smith, Phrase Weaver, Fluent Voyager, Phrase Titan).
  - **Celebration System**: Real-time level-up and milestone unlock modals.
- **📱 PWA & Offline Support**: Fully installable on iOS, Android, and Desktop with offline data persistence.
- **🔒 Local-First Privacy**: All phrase data remains stored locally in `localStorage`.

---

## 🛠️ Tech Stack

- **Framework**: [Astro JS](https://astro.build/) (v5+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4+)
- **AI Service**: [OpenRouter API](https://openrouter.ai/) (`nvidia/nemotron-3-ultra-550b-a55b:free`)
- **PWA**: [@vite-pwa/astro](https://vite-pwa-org.netlify.app/frameworks/astro.html)
- **Storage**: LocalStorage API

---

## 🚀 Local Development Setup

Requirements: **Node.js** (v22.12.0+).

1. **Clone Repository & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and add your OpenRouter API Key:
   ```bash
   cp .env.example .env
   ```
   Add your key:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   App will launch at `http://localhost:4321`.

4. **Build & Preview**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📂 Project Structure

```text
├── src/
│   ├── components/       # UI Components (CelebrationModal, InstallPrompt)
│   ├── layouts/          # Layout template (Mobile-First Frame)
│   ├── pages/            # App Routes (Dashboard, Add Phrase, Badges)
│   ├── styles/           # Global styles & CSS tokens
│   └── utils/            # Storage, Streak logic & OpenRouter AI Sync
├── public/               # Static assets & SVG icons
├── .env.example          # Environment blueprint
└── astro.config.mjs      # Astro & PWA configuration
```