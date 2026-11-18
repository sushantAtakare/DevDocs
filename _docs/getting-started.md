---
title: Getting Started
description: Orient yourself in DevDocs and publish your first documentation page.
nav_order: 1
permalink: /docs/getting-started/
layout: docs
---

## What you are building

DevDocs is a Jekyll-powered documentation site. Content is written in Markdown,
organized with a `docs` collection, and rendered through Liquid layouts into
static HTML. There is no application server at runtime - only files you can
host anywhere.

## Prerequisites

- Ruby 3.4 or newer
- Bundler (`gem install bundler` if needed)
- A text editor and a terminal

Check your toolchain:

```bash
ruby -v
bundle -v
```

## First run

From the repository root:

```bash
bundle install
bundle exec jekyll serve
```

Open [http://127.0.0.1:4000](http://127.0.0.1:4000). The homepage comes from
`index.md`. Documentation pages come from files under `_docs/`.

## Add a documentation page

1. Create a Markdown file in `_docs/`, for example `_docs/api-overview.md`.
2. Add YAML front matter with at least `title`, `description`, `nav_order`,
   `permalink`, and `layout: docs`.
3. Write the body in Markdown.
4. Rebuild or refresh `jekyll serve` - the sidebar picks up the new page
   automatically because it iterates `site.docs`.

Example front matter:

```yaml
---
title: API Overview
description: High-level map of public endpoints.
nav_order: 20
permalink: /docs/api-overview/
layout: docs
---
```

## How requests map to files

| URL path | Source |
|----------|--------|
| `/` | `index.md` with the `home` layout |
| `/docs/getting-started/` | `_docs/getting-started.md` |
| `/assets/css/style.css` | `assets/css/style.css` (copied as-is) |

## Next steps

Continue with [Installation]({{ '/docs/installation/' | relative_url }}) for
environment details, then [Project Structure]({{ '/docs/project-structure/' | relative_url }})
to learn where layouts, includes, and collections live.
