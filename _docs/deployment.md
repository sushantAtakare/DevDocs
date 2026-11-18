---
title: Deployment
description: Build DevDocs and publish the static _site output to common hosts.
nav_order: 8
permalink: /docs/deployment/
layout: docs
---

## Build for production

```bash
bundle install
bundle exec jekyll build
```

The deployable artifact is the `_site/` directory. Everything required for the
browser - HTML, CSS, and JavaScript - is inside that folder.

## Set URL options only when you know the host

In `_config.yml`:

```yaml
url: ""        # e.g. https://example.com
baseurl: ""    # e.g. /DevDocs for project sites
```

Rules of thumb:

- **Apex or custom domain at root** - `baseurl` stays empty; set `url` to the
  canonical origin if you need absolute URLs.
- **GitHub Pages project site** - set `baseurl: /<repository-name>` so
  `relative_url` prefixes asset and doc links correctly.
- **Do not hardcode** production hosts inside layouts. Prefer `relative_url`.

Restart `jekyll serve` after changing these values and click through CSS and
sidebar links before deploying.

## Hosting options

| Host | What to upload / publish |
|------|--------------------------|
| GitHub Pages | Push the repo; use Actions or `gh-pages` branch with `_site` |
| Netlify / Cloudflare Pages | Build command `bundle exec jekyll build`, publish `_site` |
| Any static file host | Upload the contents of `_site` to the web root or subpath |

Example Netlify-style settings:

```text
Build command: bundle exec jekyll build
Publish directory: _site
```

## Cache and headers

Because pages are static, long-cache hashed assets are optional. For Phase 2,
plain filenames are enough. Later you can add fingerprinting; until then, keep
`Cache-Control` modest for `style.css` and `main.js` if you iterate often.

## Smoke test after deploy

1. Homepage loads and primary nav works.
2. Documentation opens at `/docs/getting-started/` (plus your `baseurl`).
3. Sidebar links resolve for all eight guides.
4. Previous/next pager reaches the first and last pages correctly.
5. Mobile header and docs sidebar toggles still function.

## Security note

Do not commit secrets into the repository. Jekyll sites are public files once
deployed. Environment-specific tokens belong in the CI or host dashboard, not
in Markdown or `_config.yml` checked into git.

You now have the full Phase 2 documentation engine path - from authoring in
`_docs/` through a portable static deploy.
