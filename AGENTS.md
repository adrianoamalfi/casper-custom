# AGENTS.md - Casper Custom Theme Context

## 🛠️ Development & Build Commands
*   **Install Dependencies:** `yarn install`
*   **Run Dev Server:** `yarn dev` (Monitors `/assets/css/` for compilation)
*   **Build Assets:** `./node_modules/.bin/gulp build` (Compiles CSS/assets to `/assets/built/`)
*   **Package for Deployment:** `yarn zip` (Creates `dist/<theme-name>.zip`)

## ⚙️ Workflow & Tooling Quirks
*   **Styling:** CSS changes in `/assets/css/` are compiled via Gulp/PostCSS to `/assets/built/`.
*   **Templating:** Theme uses Handlebars. Custom templates can be created for specific page slugs (e.g., `page-slug.hbs` for `/slug/`).
*   **Upstream Sync:** This is a custom fork. To maintain sync with upstream Casper, ensure `origin/upstream` mirrors Casper's `main` and rebase the `custom` branch on top of it.

## 🧪 Testing & CI
*   Theme validation is run via CI on push/PR using `.github/workflows/test.yml`.

## 🧩 Architecture Notes
*   Core structure revolves around `default.hbs` (parent template) and specific templates like `index.hbs` (home), `post.hbs` (single post), and `page.hbs` (pages).