# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the browser entry point and immediately routes to `zhisheng-pharmacy-prototype.html`, which hosts the multi-tab shell for the prototype.
- Feature pages (`product-detail-page.html`, `checkout-page.html`, `orders-page.html`, etc.) live at the repository root for quick linking from the prototype shell.
- Shared presentation logic sits in `global-styles.css`, while reusable behaviors (cart, storage helpers, toasts, navigation) live in `global-script.js`.
- All media assets are stored under `assets/images/`; keep new imagery grouped by feature so designers can update SVGs without touching code.

## Build, Test, and Development Commands
- `open index.html` — Launch the prototype directly in the default browser for quick spot checks.
- `python3 -m http.server 5173` — Serve the static bundle locally to exercise navigation and `localStorage` behavior across pages.
- `npx http-server . --port 5173` — Node-based alternative when Python is unavailable; both servers mimic production routing.

## Coding Style & Naming Conventions
- Use 4-space indentation across HTML, CSS, and JS; prefer double quotes in markup and strings for consistency with existing files.
- Follow the existing hyphenated class naming (`btn-primary`, `cart-badge`) and camelCase for JavaScript identifiers (`updateBadge`, `getTotal`).
- Keep shared styles in `global-styles.css`, scoped with clear comment banners; page-specific overrides belong inline within that page’s `<style>` block.

## Testing Guidelines
- No automated tests ship with the prototype; perform manual walkthroughs covering the OTC purchase flow and the prescription flow outlined in `readme-doc.md`.
- Validate cart persistence by reloading after adding items, and clear prior state with `localStorage.clear()` or `Storage.clear()` in the console between runs.
- Capture screenshots of any UI regressions and note supported browsers (Chrome, Safari) when filing issues.

## Commit & Pull Request Guidelines
- This export does not include Git history; align on Conventional Commits (e.g., `feat: add prescription reminder modal`, `fix: restore cart badge update`).
- Reference affected pages or shared modules in the commit body, and mention any asset updates by path.
- Pull requests should describe manual test coverage, attach updated screenshots when styles change, and link to tracking tasks before requesting review.

## Data & Configuration Notes
- Client-side persistence is namespaced using the `zhisheng_` prefix; introduce new keys via `APP_CONFIG.storage` so cleanup utilities stay accurate.
- Avoid introducing external CDN dependencies; bundle new scripts locally and reference them alongside the existing global script for offline review.
