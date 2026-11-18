# Contributing to DevDocs

Thanks for helping improve DevDocs. This guide covers how we work on the
repository so documentation and site changes stay consistent and reviewable.

## Branch naming

Create a branch from the current integration branch (for example `sushant_dev`
or `main`, depending on team practice):

| Prefix | Use for |
|--------|---------|
| `feat/` | New capability or documentation section |
| `fix/` | Bug fixes in layouts, scripts, or content |
| `docs/` | Documentation-only edits |
| `chore/` | Tooling, README, config cleanup |

Examples:

```text
feat/search-empty-state
fix/docs-pager-last-page
docs/getting-started-prereqs
chore/update-contributing
```

Keep branch names lowercase, hyphen-separated, and short.

## Commit message conventions

Use concise, imperative subject lines:

```text
Add client-side docs search index
Fix sidebar active state on nested docs URLs
Document YAML front matter requirements
```

Guidelines:

- Prefer one logical change per commit when practical
- Explain **why** in the body if the diff is non-obvious
- Do not commit secrets, local `_site/` output, or editor junk
- Do not amend shared history unless the team explicitly agrees

## Creating documentation pages

1. Add a Markdown file under `_docs/`, for example `_docs/caching.md`.
2. Fill in YAML front matter (see below).
3. Write unique technical content — avoid placeholder filler.
4. If the page includes Liquid examples (`{% ... %}` or `{{ ... }}`), wrap those
   samples in `{% raw %} ... {% endraw %}` so Jekyll does not execute them.
5. Run a local build and confirm:
   - the page renders with the docs layout
   - the sidebar lists it in `nav_order`
   - previous/next links make sense
   - the page appears in `/assets/search-index.json`

## YAML front matter requirements

Every `_docs/` page must include:

```yaml
---
title: Caching
description: How DevDocs could cache generated assets in a later phase.
nav_order: 25
permalink: /docs/caching/
layout: docs
---
```

| Field | Rules |
|-------|-------|
| `title` | Human-readable page title |
| `description` | One clear sentence; used under the H1 and in search |
| `nav_order` | Number used for sidebar and pager sorting |
| `permalink` | Stable path under `/docs/.../`, usually ending with `/` |
| `layout` | Must be `docs` |

Leave gaps in `nav_order` (10, 20, 30…) if you expect to insert pages later.

## Pull request workflow

1. Sync with the latest target branch.
2. Create your feature/fix/docs branch.
3. Make focused changes; keep unrelated refactors out.
4. Validate locally:

   ```bash
   bundle install
   bundle exec jekyll build
   bundle exec jekyll serve
   ```

5. Open a pull request with:
   - a short summary of the change
   - test notes (pages checked, search queries tried, mobile sidebar/search)
   - screenshots when UI changes are visible
6. Address review feedback with follow-up commits.
7. Merge only after required checks/review approval (per team policy).

## Code and documentation quality

### Site code

- Prefer small, readable Liquid/HTML over clever nesting
- Keep CSS in `assets/css/style.css`; do not inline large style blocks
- Keep JavaScript dependency-free unless there is a strong reason otherwise
- Preserve homepage behavior when changing shared layouts/includes
- Use `relative_url` for internal links and assets

### Documentation content

- Use a clear heading hierarchy (`h2` / `h3`); the layout already provides `h1`
- Prefer concrete commands, tables, and examples over vague claims
- Cross-link related guides with Liquid `relative_url` links
- Match tone: professional, direct, and accurate to this repository

### Search quality

- Titles and descriptions are weighted more heavily than body text
- Keep descriptions specific so search results stay useful
- After adding or renaming docs, confirm `_site/assets/search-index.json`
  remains valid JSON and lists every documentation page

## Questions

If something in this guide conflicts with a newer team decision, update this
file in the same pull request that introduces the change.
