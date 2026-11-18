---
title: Project Structure
description: Map of directories and files that make up the DevDocs Jekyll site.
nav_order: 3
permalink: /docs/project-structure/
layout: docs
---

## Repository layout

DevDocs lives at the repository root - there is no nested app folder.

```text
DevDocs/
├── _config.yml          # Site-wide settings and collections
├── Gemfile              # Jekyll and platform gems
├── index.md             # Homepage content
├── docs/                # Optional plain pages under /docs/
├── _docs/               # Documentation collection source
├── _layouts/            # HTML templates (default, home, docs)
├── _includes/           # Reusable partials (header, footer, sidebar)
├── assets/
│   ├── css/style.css
│   └── js/main.js
└── _site/               # Generated output (not edited by hand)
```

## Roles of key folders

### `_docs/`

Markdown documents that belong to the `docs` collection. Each file becomes a
page when `output: true` is set for the collection. The sidebar reads this set
through `site.docs`.

### `_layouts/`

Full-page templates. Documents declare a layout in front matter
(`layout: docs`). Layouts can nest - `docs.html` sets `layout: default` so the
shared header and footer wrap every guide.

### `_includes/`

Fragments inserted with {% raw %}`{% include file.html %}`{% endraw %}. Use
includes for anything repeated across layouts (navigation chrome, documentation
sidebar).

### `assets/`

Static CSS and JavaScript. Jekyll copies them into `_site/assets/`. Reference
them with {% raw %}`{{ '/assets/css/style.css' | relative_url }}`{% endraw %} so
`baseurl` is respected.

### `_site/`

Build artifact only. It is listed in `.gitignore`. Never treat `_site` as the
source of truth.

## Naming conventions

| Kind | Convention |
|------|------------|
| Collection folder | Underscore prefix: `_docs` |
| Layouts / includes | Underscore folders: `_layouts`, `_includes` |
| Public static files | No underscore: `assets/` |
| Front matter keys | `snake_case` (`nav_order`, `permalink`) |

## Where new content goes

- Marketing or one-off pages → root Markdown (or a normal folder like `docs/`)
- Ordered technical guides → `_docs/` with `nav_order` and `layout: docs`
- Shared markup → `_includes/`
- Shared chrome or page shells → `_layouts/`

See [Architecture]({{ '/docs/architecture/' | relative_url }}) for how these
pieces connect at build time.
