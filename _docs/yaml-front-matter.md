---
title: YAML Front Matter
description: Required and optional front matter fields for DevDocs documentation pages.
nav_order: 7
permalink: /docs/yaml-front-matter/
layout: docs
---

## Anatomy

YAML front matter is a block at the top of a file, delimited by triple dashes:

```yaml
---
title: Deployment
description: Publish the generated _site folder to a static host.
nav_order: 8
permalink: /docs/deployment/
layout: docs
---
```

Jekyll parses the block into the `page` object (or the document object inside a
collection). Keys become available as `page.title`, `page.nav_order`, and so on.

## Required fields for `_docs/` pages

| Key | Type | Purpose |
|-----|------|---------|
| `title` | string | Heading in the article header and sidebar |
| `description` | string | Subtitle under the title; also used for `<meta>` |
| `nav_order` | number | Sort key for sidebar and previous/next |
| `permalink` | string | Stable public URL path |
| `layout` | string | Must be `docs` for the documentation shell |

Omitting `layout` would fall back to the collection default in `_config.yml`,
but DevDocs documents set it explicitly so each file is self-describing.

## How defaults interact

`_config.yml` can apply defaults by path or type:

```yaml
defaults:
  - scope:
      path: ""
      type: docs
    values:
      layout: docs
```

Front matter on the file always wins over defaults. Use defaults for shared
values; keep per-page titles and order on the document itself.

## Sorting rules

`nav_order` should be a number. The sidebar runs:

{% raw %}
```liquid
{% assign sorted_docs = site.docs | sort: "nav_order" %}
```
{% endraw %}

Leave gaps (10, 20, 30) if you expect to insert pages later without renumbering
everything. DevDocs Phase 2 uses a dense 1-8 sequence for the core guides.

## Permalinks and collisions

Choose permalinks under `/docs/...` that do not clash with plain pages. The
collection template `/docs/:name/` already suggests a path from the filename;
an explicit `permalink` documents the contract in the file and avoids surprises
if the filename changes.

## Validation checklist

Before merging a new guide:

1. Front matter opens and closes with `---`.
2. `nav_order` is unique enough for a deterministic order.
3. `permalink` ends with `/` to match pretty URLs.
4. `layout` is `docs`.
5. `description` is one clear sentence (no placeholder filler).

Finish the core guides with
[Deployment]({{ '/docs/deployment/' | relative_url }}).
