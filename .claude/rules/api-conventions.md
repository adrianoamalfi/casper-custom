# Ghost Theme API Conventions

## Ghost Content API
- Access via Ghost helpers only — never call the Ghost API directly from theme JS
- Use `{{@site.*}}` for site-level data, `{{@member.*}}` for membership context
- Membership gating: `{{#if @member.paid}}` for paid content, `{{#if @member}}` for free members

## Theme Custom Settings (package.json `config.custom`)
- All new settings must be declared in `package.json` under `config.custom`
- Use `type: "select"` with explicit options for controlled values
- Group settings under `"homepage"` or `"post"` as appropriate
- Access in HBS: `{{@custom.setting_name}}`

## Localization
- All user-facing strings in `locales/en.json`
- Use `{{t "String"}}` helper in templates — never hardcode display text
- Italian defaults are set in `package.json` `config.custom` default values
