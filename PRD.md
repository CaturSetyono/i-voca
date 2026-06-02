# Product Requirement Document (PRD) - VocabForge (Updated)

**Version:** 1.1 (Post-Implementation Update)
**Status:** Live / Active Development
**Architecture:** Zero-Server, Client-Side Only (LocalStorage)

---

## 1. Executive Summary

VocabForge is a gamified Progressive Web App (PWA) designed for personal vocabulary building. It eliminates traditional barriers like account registration or internet requirements by operating entirely on the user's device. The application focuses on an "App-First" experience, where users are immediately presented with their progress and tools for learning.

## 2. Updated Product Vision & Core Philosophy

- **App-First Architecture**: Unlike traditional apps with landing pages, VocabForge puts the application core at the root (`/`). 
- **Privacy by Design**: No cloud syncing. All data stays in `localStorage`.
- **Tactile Gamification**: Using "Claymorphic" (Neo-Brutalism Minimalist) design to make digital interactions feel physical and rewarding.
- **High Performance**: Leveraging Astro's static generation and View Transitions for a seamless, SPA-like mobile experience.

---

## 3. Implemented Functional Requirements

| ID | Feature | Description | Status |
| --- | --- | --- | --- |
| **FR-01** | **PWA Capabilities** | Full offline support, manifest, and service worker registration. | ✅ Done |
| **FR-02** | **Vocab CRUD** | Add, view, and delete vocabulary entries (ID <-> EN). | ✅ Done |
| **FR-03** | **XP & Level System** | +10 XP per word. Levels up every 100 XP. | ✅ Done |
| **FR-04** | **Milestone Badges** | Auto-unlock at 10, 25, 50, and 100 words. | ✅ Done |
| **FR-05** | **Celebration System** | Global modal for level-ups and badge unlocks using Event-Driven state. | ✅ Done |
| **FR-06** | **Smart Install Prompt** | Device detection for iOS and Android tailored instructions. | ✅ Done |
| **FR-07** | **Instant Search** | Client-side filtering of the vocabulary list. | ✅ Done |
| **FR-08** | **SPA Navigation** | Smooth view transitions between Dashboard, Add, and Badges pages. | ✅ Done |

---

## 4. UI/UX Specifications (Actual)

- **Layout**: Mobile-First Frame (`440px` max-width on desktop) with a phone notch emulation.
- **Theme**: Off-White background (`#F8FAFC`), Deep Navy Blue accents (`#1E3A8A`), and Emerald Green success states (`#10B981`).
- **Typography**: 
  - Display/Headings: `Quicksand` (Bold).
  - Body/UI: `Nunito Sans`.
- **Interactions**: Tactile 3D buttons with `active:translate-y` effects and block shadows.

---

## 5. Data Schema & Gamification Logic

### 5.1 Storage (LocalStorage)
- `vocab_forge_data`: Array of objects `[{id, word_id, word_en, created_at}]`.
- `vocab_forge_profile`: Object `{current_xp, level, unlocked_badges}`.
- `vocab_forge_pending`: Queue for celebrations not yet shown to the user.

### 5.2 Badges Matrix
- `badge_01` (Novice Smith): 10 Words.
- `badge_02` (Word Weaver): 25 Words.
- `badge_03` (Fluent Voyager): 50 Words.
- `badge_04` (Vocab Titan): 100 Words.

---

## 6. Development Roadmap (Next Phases)

- **Data Portability**: Export/Import JSON feature to prevent data loss when clearing browser cache.
- **Advanced Gamification**: Daily streaks and varied XP rewards.
- **Enhanced UI**: Dark mode support and custom theme colors.
- **Accessibility**: ARIA labels and keyboard navigation improvements.
