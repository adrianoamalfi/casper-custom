# Casper

A classic theme for [Ghost](http://github.com/tryghost/ghost/), originally the default theme. These days, our default theme is [Source](http://github.com/tryghost/source/)

This is the latest development version of Casper! If you're just looking to download the latest release, head over to the [releases](https://github.com/TryGhost/Casper/releases) page.

&nbsp;

![screenshot-desktop](https://user-images.githubusercontent.com/1418797/183329195-8e8f2ee5-a473-4694-a813-a2575491209e.png)

&nbsp;

# First time using a Ghost theme?

Ghost uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

This theme has lots of code comments to help explain what's going on just by reading the code. Once you feel comfortable with how everything works, we also have full [theme API documentation](https://ghost.org/docs/themes/) which explains every possible Handlebars helper and template.

**The main files are:**

- `default.hbs` - The parent template file, which includes your global header/footer
- `index.hbs` - The main template to generate a list of posts, usually the home page
- `post.hbs` - The template used to render individual posts
- `page.hbs` - Used for individual pages
- `tag.hbs` - Used for tag archives, eg. "all posts tagged with `news`"
- `author.hbs` - Used for author archives, eg. "all posts written by Jamie"

One neat trick is that you can also create custom one-off templates by adding the slug of a page to a template file. For example:

- `page-about.hbs` - Custom template for an `/about/` page
- `tag-news.hbs` - Custom template for `/tag/news/` archive
- `author-ali.hbs` - Custom template for `/author/ali/` archive


# Development

Casper styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# install dependencies
yarn install

# run development server
yarn dev

# build compiled assets
./node_modules/.bin/gulp build
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
# create .zip file
yarn zip
```

# PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.
- [Color Mod](https://github.com/jonathantneal/postcss-color-mod-function)


# SVG Icons

Casper uses inline SVG icons, included via Handlebars partials. You can find all icons inside `/partials/icons`. To use an icon just include the name of the relevant file, eg. To include the SVG icon in `/partials/icons/rss.hbs` - use `{{> "icons/rss"}}`.

You can add your own SVG icons in the same manner.

# Custom fork notes

This repository is maintained as a custom fork of Casper with the goal of staying easy to rebase on top of [TryGhost/Casper](https://github.com/TryGhost/Casper).

To keep upstream sync low-friction:

- Keep `origin/upstream` as a mirror of Casper's `main`
- Rebase `custom` on top of `origin/upstream`
- Prefer isolated customisations in these areas:
  - `partials/brand/*` for personal or editorial sections
  - `assets/css/screen.css` custom block at the end of the file
  - `assets/js/brand.js` for custom front-end behaviour
- Avoid broad edits across core Casper templates when a partial or CSS/JS override is enough

GitHub Actions:

- `.github/workflows/sync-upstream.yml` keeps the local `upstream` branch aligned with `TryGhost/Casper`
- `.github/workflows/test.yml` installs dependencies and runs theme validation on push and pull request

# Flusso fotografico

The theme includes a lightweight photo workflow built on top of Ghost posts:

- Tag photo posts with the internal tag `#photos`
- Tag AI-generated image posts with the internal tag `#ai-art-and-images`
- Assign the custom template `photo` to photo posts when you want the dedicated single-photo layout
- Create a page with slug `photos` to use `page-photos.hbs` as the public photo archive
- Create a page with slug `ai-art` to use `page-ai-art.hbs` as the public AI Art archive
- The homepage automatically shows the latest posts tagged with `#photos`
- Use the feature image caption on `photo` posts for visible field notes beneath the image

# Responsive images

The theme now uses Ghost's native responsive image pipeline with modern formats:

- `AVIF` is served first through `<picture>`
- `WebP` is used as the next fallback
- the original Ghost rendition remains the final `<img>` fallback

Image variants are defined in `package.json` under `config.image_sizes`:

- `xxs`: 30px
- `xs`: 100px
- `s`: 300px
- `m`: 600px
- `l`: 1000px
- `xl`: 2000px
- `xxl`: 2400px

Reusable image partials live in `/partials/media/`:

- `picture-hero.hbs` for LCP and feature images
- `picture-card.hbs` for feed cards and visual thumbnails
- `picture-ui.hbs` for logos, avatars, and small UI images

Implementation rules:

- only true above-the-fold hero images use `fetchpriority="high"` and `loading="eager"`
- cards and secondary media use `loading="lazy"`
- card and thumbnail wrappers reserve space with CSS `aspect-ratio` or ratio placeholders to reduce CLS

# Translations

Please see [@TryGhost/Themes/theme-translations/README.md](https://github.com/TryGhost/Themes/blob/main/packages/theme-translations/README.md) for how to build, edit, or contribute translations.

# Copyright & License

Copyright (c) 2013-2026 Ghost Foundation - Released under the [MIT license](LICENSE).
