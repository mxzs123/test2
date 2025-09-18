# Repository Guidelines

## Project Structure & Module Organization
The prototype boots from `index.html`, which immediately routes to `zhisheng-pharmacy-prototype.html` where the multi-tab shell lives. Feature pages such as `product-detail-page.html`, `checkout-page.html`, and `orders-page.html` sit at the repository root for quick linking. Shared presentation is centralized in `global-styles.css`, while reusable behaviors (navigation, cart, toasts, storage helpers) live in `global-script.js`. Store images under `assets/images/`, grouped by feature to simplify designer handoffs.

## Build, Test, and Development Commands
- `open index.html` — Launches the prototype for rapid spot checks in the default browser.
- `python3 -m http.server 5173` — Serves the static bundle locally, enabling multi-page navigation and `localStorage` behavior.
- `npx http-server . --port 5173` — Node-based local server alternative when Python is unavailable.
Clear `localStorage` between sessions using the browser console (`localStorage.clear()`) to avoid stale cart data.

## Coding Style & Naming Conventions
Use 4-space indentation across HTML, CSS, and JavaScript. Prefer double quotes in markup and string literals. Follow existing hyphenated class naming (`btn-primary`, `cart-badge`) and camelCase for JavaScript (`updateBadge`, `getTotal`). Place shared styles in `global-styles.css` under clearly labeled comment banners; limit page-specific overrides to inline `<style>` blocks on each page.

## Testing Guidelines
No automated suite ships with the prototype. Perform manual walkthroughs covering OTC and prescription flows described in `readme-doc.md`. Confirm cart persistence by reloading after adding items, and document UI regressions with screenshots noting affected browsers (Chrome, Safari).

## Commit & Pull Request Guidelines
Use Conventional Commits (e.g., `feat: add prescription reminder modal`, `fix: restore cart badge update`). Reference touched pages or shared modules in the body and mention asset updates by path. For pull requests, describe manual test coverage, attach updated screenshots for style changes, and link to tracking tasks before requesting review.

## Data & Configuration Notes
Namespaced storage keys with the `zhisheng_` prefix keep cleanup utilities accurate. Add new keys via `APP_CONFIG.storage`, and avoid external CDN dependencies; bundle scripts locally alongside `global-script.js` for offline reviews.
