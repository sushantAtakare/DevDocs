---
title: Liquid Templates
description: How DevDocs uses Liquid layouts, includes, filters, and control flow.
nav_order: 6
permalink: /docs/liquid-templates/
layout: docs
---

## Layout nesting

Documentation pages declare `layout: docs`. The docs layout itself declares
`layout: default`:

```text
_docs/page.md  →  docs.html  →  default.html  →  final HTML
```

{% raw %}`{{ content }}`{% endraw %} in each layout is replaced by the rendered
output of the inner layer. That is how the article body ends up inside the site
chrome without duplicating the header and footer.

## Includes

Includes keep repeated markup in one place:

{% raw %}
```liquid
{% include header.html %}
{% include docs-sidebar.html %}
{% include footer.html %}
```
{% endraw %}

Includes share the same Liquid context as the caller, so `page`, `site`, and
assign variables from the parent layout are available.

## Working with `site.docs`

Every document in the `docs` collection is an object in `site.docs` with
properties from front matter plus generated fields such as `url` and
`content`.

{% raw %}
```liquid
{% assign sorted_docs = site.docs | sort: "nav_order" %}
{% for doc in sorted_docs %}
  <a href="{{ doc.url | relative_url }}">{{ doc.title }}</a>
{% endfor %}
```
{% endraw %}

This is the mechanism behind the documentation sidebar - no hardcoded list of
paths.

## Filters DevDocs relies on

| Filter | Purpose |
|--------|---------|
| `relative_url` | Prefix `site.baseurl` for portable links |
| `sort` | Order collection documents by a front matter key |
| `escape` | Safe output in attributes such as `meta` description |
| `default` | Fallback when a page field is blank |

## Control flow for navigation state

Active links compare the current page to each item:

{% raw %}
```liquid
{% if doc.url == page.url %}
  {% assign is_active = true %}
{% endif %}
```
{% endraw %}

Previous/next links walk the sorted collection once, remembering the document
before the current page and capturing the first document after it. The logic
lives in `_layouts/docs.html` so every guide gets a pager for free.

## Keep logic out of Markdown when possible

Authors should write prose and occasional inline links. Sorting, active states,
and chrome belong in layouts and includes. That split keeps articles stable
when the UI changes.

Continue with [YAML Front Matter]({{ '/docs/yaml-front-matter/' | relative_url }})
for the metadata contract each doc must satisfy.
