# Testing

- Theme validation: `yarn test` (gscan) before every PR
- CI gate: `yarn test:ci` must pass with zero fatal errors
- Always run `yarn zip` before any gscan validation (pretest hook handles this)
- Manual browser test required for visual changes: check light mode, dark mode, mobile
- Framework: gscan (Ghost theme validator)
- No unit test framework — Ghost themes are validated structurally by gscan
