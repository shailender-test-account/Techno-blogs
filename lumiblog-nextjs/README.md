# LumiBlog — Next.js + Redux Toolkit + Tailwind CSS

This is the original static `LumiBlog` HTML page converted into a componentized
Next.js (App Router) project, with all interactive state (auth modal, alerts,
success overlay) managed by Redux Toolkit, and Tailwind CSS for styling.

## 1. Folder structure

```
lumiblog-nextjs/
├── package.json
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.js
├── jsconfig.json
├── README.md
└── src/
    ├── app/
    │   ├── layout.jsx          # Root layout: fonts, FontAwesome CDN, Redux provider
    │   ├── page.jsx            # Home page — composes all sections
    │   └── globals.css         # Tailwind directives + custom animation CSS
    │
    ├── components/
    │   ├── Navbar.jsx          # Top nav, mobile menu, scroll shadow
    │   ├── Hero.jsx            # Hero section
    │   ├── TrendingBar.jsx     # "Trending now" strip
    │   ├── FeaturedArticles.jsx# Article cards + newsletter + categories
    │   ├── EditorsPicks.jsx    # Editor's picks card row
    │   ├── Footer.jsx          # Footer
    │   ├── AuthModal.jsx       # Login/Register modal (validation, strength meter)
    │   ├── AlertContainer.jsx  # Toast/alert stack (top of screen)
    │   ├── SuccessOverlay.jsx  # Success overlay + confetti
    │   └── Reveal.jsx          # Scroll-reveal wrapper (IntersectionObserver)
    │
    ├── hooks/
    │   └── useScrollReveal.js  # IntersectionObserver hook used by Reveal.jsx
    │
    └── redux/
        ├── store.js            # configureStore() with all reducers
        ├── ReduxProvider.jsx   # Client component wrapping <Provider>
        └── slices/
            ├── modalSlice.js   # isOpen, formType ('login' | 'register')
            ├── alertSlice.js   # queue of toast alerts
            ├── uiSlice.js      # success overlay visibility/content
            └── authSlice.js    # mock user/isAuthenticated state
```

## 2. Prerequisites

- Node.js 18.18+ (or 20+) and npm installed.

## 3. Step-by-step setup

**Step 1 — Create the project folder and copy in the files**

Copy every file from this delivered project into a folder, e.g. `lumiblog-nextjs/`,
keeping the exact paths shown above.

**Step 2 — Install dependencies**

```bash
cd lumiblog-nextjs
npm install
```

This installs:
- `next`, `react`, `react-dom` — the framework
- `@reduxjs/toolkit`, `react-redux` — state management
- `tailwindcss`, `postcss`, `autoprefixer` — styling

**Step 3 — Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The auth modal auto-opens
after 3 seconds, exactly like the original static page.

**Step 4 — Build for production (optional)**

```bash
npm run build
npm run start
```

## 4. How Tailwind is wired up

- `tailwind.config.js` — `content` globs point at `src/app` and `src/components`;
  `theme.extend` reproduces the original `brand` color palette, `fontFamily`,
  and all custom `keyframes`/`animation` utilities (`float`, `pulse-glow`, etc.).
- `postcss.config.mjs` — loads the `tailwindcss` and `autoprefixer` plugins.
- `src/app/globals.css` — starts with the three `@tailwind` directives, then
  keeps every bit of hand-written CSS from the original `<style>` block that
  isn't expressible as a Tailwind utility (custom keyframes for the checkmark,
  confetti, button loader spinner, alert slide transitions, etc.).
- Google Fonts (`Inter`, `Playfair Display`) are loaded via `next/font/google`
  in `src/app/layout.jsx` instead of a `<link>` tag — this is the recommended
  Next.js approach (self-hosted, no layout shift) and is mapped to the same
  `font-sans` / `font-serif` Tailwind classes via CSS variables.
- FontAwesome icons are kept as the original CDN `<link>` tag in `layout.jsx`
  since Next.js has no first-party FontAwesome integration.

## 5. How Redux is wired up

- `src/redux/store.js` combines four slices: `modal`, `alerts`, `ui`, `auth`.
- `src/redux/ReduxProvider.jsx` is a `"use client"` component wrapping
  `<Provider store={store}>`; it's mounted once in `app/layout.jsx` around
  `{children}`, so every page/component in the app can `useSelector`/`useDispatch`.
- **Modal** (`modalSlice`): `openModal('login' | 'register')`, `closeModal()`,
  `switchForm(type)` — replaces the old `openModal()`/`closeModal()`/`switchForm()`
  vanilla JS functions.
- **Alerts** (`alertSlice`): `addAlert(message, type)` / `removeAlert(id)` —
  replaces `showAlert()` / `removeAlert()`. Each `<AlertItem>` self-removes
  after 4s via a `useEffect` timer, mirroring the original `setTimeout`.
- **UI / success overlay** (`uiSlice`): `showSuccessOverlay({ title, message, withConfetti })`
  / `hideSuccessOverlay()` — replaces `showSuccessOverlay()` / `hideSuccessOverlay()`,
  including the confetti particle generation (now done with `useMemo` + inline styles).
- **Auth** (`authSlice`): `loginSuccess(user)` / `registerSuccess(user)` / `logout()` —
  a lightweight mock of what a real auth flow would update in the store once
  you wire up a real API.

Form field values, per-field "touched" validation state, password visibility
toggles, the password-strength meter, and the button loading spinner are kept
as local `useState` in `AuthModal.jsx`, since that state is private to the form
and doesn't need to be global.

## 6. Notes / things to customize

- All article/category card data is currently inline (arrays at the top of
  `FeaturedArticles.jsx` / `EditorsPicks.jsx`). Swap these for a CMS or API call
  whenever you're ready.
- `handleLogin` / `handleRegister` in `AuthModal.jsx` currently simulate a
  network call with `setTimeout`. Replace the `setTimeout` block with a real
  `fetch`/API call, and dispatch `loginSuccess`/`registerSuccess` on a 200 response
  and `addAlert(errorMessage, 'error')` on failure.
- Unsplash image URLs were kept as-is; `next.config.mjs` already whitelists
  `images.unsplash.com` if you switch the `<img>` tags to `next/image`.
