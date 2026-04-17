# Deploy Skill

Triggered when the user asks to deploy, release, or publish the theme.

## Behavior
1. Read `deploy-config.md` for environment targets
2. Run pre-deploy checks: `yarn test:ci` (must pass with zero fatal errors)
3. Build the theme zip: `yarn zip`
4. For **local dev**: Gulp watches and syncs automatically — no manual deploy needed
5. For **production**: present the zip path and Ghost Admin URL to the user for manual upload (Law III.2 — irreversible action requires human execution)
6. Report success or failure with logs
