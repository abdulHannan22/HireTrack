# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

# HireTrack — Frontend

Minimal React + Vite frontend for HireTrack.

**Prerequisites**
- Node.js 18+ (or compatible LTS)
- npm (or yarn / pnpm)

**Quick start**

```bash
cd Frontend
npm install
npm run dev
```

The dev server runs (by default) at `http://localhost:5173` or the next free port.

**Build / Preview**

```bash
npm run build
npm run preview
```

**Environment variables**
- `VITE_API_URL` — base URL for the backend API (default: `http://localhost:3001`).

Create a local `.env` file in `Frontend` (do not commit):

```
VITE_API_URL=http://localhost:3001
```

**Tailwind CSS**
Tailwind is configured in `tailwind.config.js` and imported in `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

If Tailwind styles do not appear, restart the dev server and hard-refresh the browser.

**Notes**
- A `.gitignore` exists to exclude `node_modules`, build output and local env files.
- The frontend expects the backend API to be available at `VITE_API_URL` (default `http://localhost:3001`).

If you want, I can add placeholder pages for `/board`, `/applications`, and `/stats` so the app no longer depends on missing components.
