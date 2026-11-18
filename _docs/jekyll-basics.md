---
title: Jekyll Basics
description: Core Jekyll concepts used by DevDocs - build, content types, and permalinks.
nav_order: 5
permalink: /docs/jekyll-basics/
layout: docs
---

## What Jekyll does

Jekyll is a static site generator. It reads source files, applies templates,
and writes a folder of HTML and assets. DevDocs pins **Jekyll 4.4.1** in the
`Gemfile`.

## Content types you will touch

| Type | Location | Liquid access |
|------|----------|---------------|
| Pages | `*.md` / `*.html` outside underscore dirs | `site.pages` |
| Collections | `_docs/` | `site.docs` |
| Data files | `_data/` (not used yet) | `site.data` |
| Static files | `assets/` | copied to `_site` |

Underscore-prefixed directories are special: Jekyll treats them as structured
inputs rather than copy-through folders (except when configured otherwise).

## Front matter is mandatory for templates

A file without YAML front matter is copied as a static file. A file with front
matter is processed as a page or document:

```markdown
---
title: Example
layout: docs
---

Body starts here.
```

The opening `---` lines matter. See
[YAML Front Matter]({{ '/docs/yaml-front-matter/' | relative_url }}) for the
keys DevDocs expects on documentation entries.

## Permalinks

Global setting in `_config.yml`:

```yaml
permalink: pretty
```

Pretty permalinks turn `getting-started.md` into a directory with `index.html`,
so URLs look like `/docs/getting-started/`. Collection documents also set an
explicit `permalink` in front matter for clarity and stable links.

## Liquid in content and layouts

Layouts and includes are HTML with Liquid tags:

{% raw %}
- `{{ page.title }}` - output a value
- `{% if page.collection == "docs" %}` - control flow
- `{% for doc in site.docs %}` - iteration
- `{{ doc.url | relative_url }}` - filter pipeline
{% endraw %}

Markdown bodies can embed Liquid too. Prefer keeping complex logic in layouts
and includes so articles stay readable.

## Local development loop

```bash
bundle exec jekyll serve
```

Jekyll watches the source tree, regenerates `_site`, and serves it. Changing
`_config.yml` usually requires restarting the server.

When you are comfortable with the generator, continue to
[Liquid Templates]({{ '/docs/liquid-templates/' | relative_url }}).
