# casper-custom

## Project Overview
Custom fork of the Ghost Casper theme for adrianoamalfi.com. Extends the official Casper theme with personal branding, dark mode, custom layouts (Tech Digest, Scratchpad), and Italian-language defaults.

## Tech Stack
- **Language**: JavaScript, Handlebars (HBS), PostCSS
- **Platform**: Ghost CMS ≥ 5.0.0 (theme)
- **Build**: Gulp 5, PostCSS (autoprefixer, cssnano, postcss-easy-import)
- **Syntax highlighting**: highlight.js 11
- **Validator**: gscan 5
- **Database**: none (Ghost theme — no direct DB access)
- **Infrastructure**: none (uploaded as zip to Ghost Admin)

## Commands
| Command | Description |
|---|---|
| `yarn dev` | Start Gulp dev server with live reload |
| `yarn zip` | Build theme zip to `dist/casper-custom.zip` |
| `yarn test` | Run gscan validation on built zip |
| `yarn test:ci` | gscan with `--fatal --verbose` (CI mode) |
| `yarn ship` | Version bump + git push + release |
| `yarn sync-upstream` | Rebase from upstream Casper |

## Coding Conventions & Architecture

### Ghost Theme Rules
- Use Ghost helpers (`{{@site}}`, `{{@blog}}`, `{{ghost_head}}`, `{{ghost_foot}}`) — never hardcode values
- Templates follow Ghost naming: `index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`, custom ones in `custom-*.hbs`
- Partials live in `partials/` and are included via `{{> partial-name}}`
- All theme strings must appear in `locales/en.json` for i18n support
- Ghost membership helpers: use `{{#if @member}}` / `{{#if @member.paid}}` for access gating

### CSS / PostCSS
- Source in `assets/css/`, built output in `assets/built/`
- Use CSS custom properties (`--var`) for theming — avoid magic numbers
- Dark mode via `[data-theme="dark"]` attribute on `<html>`
- No SASS/LESS — PostCSS only; imports via `postcss-easy-import`
- BEM-inspired class names for custom components: `.kg-card`, `.gh-*`, `.custom-*`

### JavaScript
- Vanilla JS only — no jQuery, no external frameworks
- Scripts in `assets/js/`, bundled by Gulp
- Respect `prefers-reduced-motion` for animations
- Use `IntersectionObserver` / `ResizeObserver` over scroll listeners

### Build
- Always run `yarn zip` before `yarn test`
- Validate with gscan before shipping: `yarn test:ci`
- Never commit `dist/` — it is generated on ship

### Git
- Branch: `custom` (main working branch)
- Upstream: official Ghost Casper repo (synced via `yarn sync-upstream`)
- Commits: conventional style, imperative mood

---

## The Three Laws of Agentic AI

These laws are binding for every agent operating in this project.
They are listed in priority order: in case of conflict, the preceding law takes precedence.

### Law I — Scope and Boundaries
An agent must act only within clear boundaries and in service of a declared purpose.
- It cannot exceed the perimeter of data, processes, and identity assigned to it.
- It must operate exclusively for an explicit and non-interpretable purpose.
- In the presence of ambiguity, it must suspend action and ask for clarification.

### Law II — System Integrity
An agent must preserve the integrity of the system and the resources it uses.
- It must respect computational limits, avoiding excessive complexity and unnecessary processes.
- It cannot modify critical elements without adequate safeguards.
- It must adopt conservative fallbacks when the context is uncertain or fragile.

### Law III — Transparency and Human Control
An agent must make its reasoning transparent and cannot replace human judgment.
- It must expose sources, assumptions, and logical steps behind its proposals.
- It can suggest, filter, and facilitate, but cannot make irreversible or high-impact decisions.
- Final control always remains human.

---

## Notes
- See `CLAUDE.local.md` for local overrides (not committed)
- Rules in `.claude/rules/` apply automatically by topic
- See `.claude/rules/asimov-laws.md` for operational enforcement details
