# DevDocs
Developer Documentation & Static Website Platform

DevDocs is a Jekyll-based static website for publishing developer documentation —
guides, API references, and technical knowledge — with a clean, minimal interface.

## Stack

- Jekyll 4.4.1
- Ruby 3.4.x
- Liquid, Markdown, YAML, HTML5, CSS3, JavaScript

## Local development

Requirements: Ruby 3.4+ and Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Open [http://127.0.0.1:4000](http://127.0.0.1:4000).

Build only (no server):

```bash
bundle exec jekyll build
```

Generated files appear in `_site/`.

## Project structure (Phase 1)

| Path | Role |
|------|------|
| `Gemfile` | Ruby gem dependencies (Jekyll) |
| `_config.yml` | Site metadata and build defaults |
| `index.md` | Homepage content |
| `docs/index.md` | Documentation landing page |
| `_layouts/` | Page templates (`default`, `home`) |
| `_includes/` | Reusable partials (`header`, `footer`) |
| `assets/css/style.css` | Site styles |
| `assets/js/main.js` | Client-side behavior |

## Notes

- No prebuilt Jekyll theme is used.
- `url` and `baseurl` in `_config.yml` stay empty so asset paths work locally
  and on any host without hardcoding a GitHub Pages production URL.
- Phase 2+ will expand documentation structure, search, and content workflows.
