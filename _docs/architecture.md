---
title: Architecture
description: How requests, collections, layouts, and assets flow through DevDocs.
nav_order: 4
permalink: /docs/architecture/
layout: docs
---

## High-level flow

```text
Markdown + YAML  →  Jekyll build  →  Static HTML/CSS/JS in _site/
                         │
                         ├─ Liquid layouts and includes
                         ├─ Kramdown Markdown rendering
                         └─ Collection membership (site.docs)
```

At runtime the host only serves files. All Liquid evaluation and Markdown
conversion happen during `jekyll build` or `jekyll serve`.

## Request path (conceptual)

1. The browser requests `/docs/jekyll-basics/`.
2. The host returns `_site/docs/jekyll-basics/index.html` (pretty permalinks).
3. That HTML already contains the rendered sidebar, article, and pager.
4. The browser loads `/assets/css/style.css` and `/assets/js/main.js` as normal
   static assets.

There is no database query and no per-request template render in production.

## Layering inside a documentation page

| Layer | Responsibility |
|-------|----------------|
| `_docs/*.md` | Title, description, order, body content |
| `_layouts/docs.html` | Docs chrome: sidebar slot, title block, pager |
| `_layouts/default.html` | Document shell: `<head>`, site header/footer |
| `_includes/docs-sidebar.html` | Dynamic list from `site.docs` |
| `assets/*` | Presentation and progressive enhancement |

## Collection vs pages

- **Pages** (`index.md`, `docs/index.md`) live outside collections. They appear
  in `site.pages`.
- **Collection documents** in `_docs/` appear in `site.docs` and carry
  `page.collection == "docs"`.

The documentation engine prefers the collection because it gives a single
enumerable list for sidebar generation, sorting, and previous/next links.

## Configuration surface

`_config.yml` owns:

- Site metadata (`title`, `description`)
- `collections.docs` with `output: true`
- Default front matter for the `docs` type
- Header navigation entries

Content authors should rarely edit layouts for routine doc changes - front
matter plus Markdown is enough.

## Design constraints carried from Phase 1

- No third-party Jekyll theme
- Empty `url` / `baseurl` by default
- Homepage (`layout: home`) remains separate from the docs shell
- Visual language (light surface, dark header) is shared via `style.css`

Next: [Jekyll Basics]({{ '/docs/jekyll-basics/' | relative_url }}) for the
core mental model of the generator itself.
