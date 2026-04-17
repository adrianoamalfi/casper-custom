# /project:review

Review the current branch for correctness, security, and style.

Steps:
1. Run `git diff main...HEAD` to see all changes
2. Check for security issues (XSS via HBS triple-stash `{{{...}}}`, secrets in code)
3. Verify gscan would pass: check for missing required templates or deprecated helpers
4. Flag style violations per `.claude/rules/code-style.md`
5. Check that any new user-facing strings are in `locales/en.json`
6. Summarize findings as: ✅ looks good / ⚠️ suggestions / ❌ blockers
