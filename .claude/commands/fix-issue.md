# /project:fix-issue

Fix a GitHub issue given its number or description.

Usage: `/project:fix-issue #123` or `/project:fix-issue <description>`

Steps:
1. Read the issue details from GitHub (repo: adrianoamalfi/casper-custom)
2. Locate relevant HBS templates, CSS, or JS files
3. Implement the minimal fix
4. Run `yarn test` to validate with gscan
5. Summarize what changed and why
