# Code Style

## General
- Prefer explicit over implicit
- No comments unless the WHY is non-obvious
- Max line length: 100 chars

## Handlebars (HBS)
- Use Ghost helpers exclusively — no hardcoded site names, URLs, or config values
- Partial names: kebab-case matching filename (`{{> post-card}}` → `partials/post-card.hbs`)
- Avoid logic in templates; move complexity to Ghost custom routes or helpers
- Always wrap conditional blocks: `{{#if condition}}...{{else}}...{{/if}}`

## CSS / PostCSS
- CSS custom properties for all colors, spacing, and typography tokens
- Dark mode selectors: `[data-theme="dark"] .selector { ... }`
- Class names: `.gh-*` for Ghost core elements, `.custom-*` for theme additions
- No inline styles; no `!important` unless overriding a Ghost card default
- Import order in `screen.css`: variables → reset → layout → components → utilities

## JavaScript
- Vanilla JS only — no jQuery, no frameworks
- `const` by default, `let` when reassignment is needed, never `var`
- Arrow functions for callbacks; named functions for top-level declarations
- No `console.log` in committed code
- Respect `prefers-reduced-motion` for all animations
