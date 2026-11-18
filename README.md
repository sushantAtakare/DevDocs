# DevDocs

Developer Documentation & Static Website Platform

DevDocs is a Jekyll-based documentation website for publishing technical guides,
API-oriented knowledge, and project references as a fast static site. Content is
written in Markdown, organized with a documentation collection, and rendered
through Liquid layouts with a custom (theme-free) UI.

## Features

- Clean homepage introducing the platform
- Documentation collection under `_docs/` with ordered sidebar navigation
- Previous / next paging across guides
- Client-side documentation search (no backend required)
- Responsive layout with accessible header and docs sidebar toggles
- Portable asset URLs via `relative_url` (no hardcoded production host)

## Technology stack

| Layer | Choice |
|-------|--------|
| Static site generator | Jekyll 4.4.1 |
| Runtime for builds | Ruby 3.4.x |
| Templates | Liquid |
| Content | Markdown + YAML front matter |
| Markup / style / behavior | HTML5, CSS3, vanilla JavaScript |

No prebuilt Jekyll theme and no large client-side search framework are used.

## Prerequisites

- Ruby **3.4+**
- Bundler (`gem install bundler` if needed)
- A terminal with Ruby's `bin` directory on `PATH`

Check versions:

```bash
ruby -v
bundle -v
```

On Windows, if `ruby` is not found, add the Ruby installer's `bin` folder to
`PATH` (for example `C:\Ruby34-x64\bin`).

## Installation

From the repository root:

```bash
bundle install
```

This installs Jekyll and the platform gems declared in the `Gemfile`.

## Local development

Start the development server:

```bash
bundle exec jekyll serve
```

Open [http://127.0.0.1:4000](http://127.0.0.1:4000).

Useful options:

```bash
bundle exec jekyll serve --livereload
bundle exec jekyll serve --port 4001
```

After changing `_config.yml`, restart the server so collections and defaults reload.

Documentation entry point:

- [http://127.0.0.1:4000/docs/getting-started/](http://127.0.0.1:4000/docs/getting-started/)

## Build instructions

Produce the static site in `_site/`:

```bash
bundle exec jekyll build
```

Verify the documentation search index was generated:

- `_site/assets/search-index.json`

The `_site/` directory is build output only and is ignored by git.

## Project structure

```text
DevDocs/
├── Gemfile                     # Jekyll dependency
├── _config.yml                 # Site config, docs collection, navigation
├── index.md                    # Homepage
├── docs/index.md               # Docs entry page
├── _docs/                      # Documentation collection source
├── _layouts/                   # default, home, docs
├── _includes/                  # header, footer, sidebar, search UI
├── assets/
│   ├── css/style.css
│   ├── js/main.js              # Nav / sidebar toggles
│   ├── js/search.js            # Client-side docs search
│   └── search-index.json       # Liquid-generated search index source
├── README.md
├── CONTRIBUTING.md
└── _site/                      # Generated output (not edited by hand)
```

## Deployment overview

1. Set `url` / `baseurl` in `_config.yml` only when you know the final host
   (leave them empty for local root hosting).
2. Run `bundle exec jekyll build`.
3. Publish the contents of `_site/` to any static host (GitHub Pages, Netlify,
   Cloudflare Pages, S3/CloudFront, nginx, etc.).

For a GitHub Pages **project** site, set `baseurl` to `/<repository-name>` so
CSS, documentation links, and the search index resolve correctly.

Do not hardcode a production GitHub Pages URL inside layouts. Prefer the
`relative_url` filter.

## Documentation authoring (short)

1. Add a Markdown file under `_docs/`.
2. Include front matter: `title`, `description`, `nav_order`, `permalink`,
   `layout: docs`.
3. Rebuild or refresh `jekyll serve`.
4. Confirm the page appears in the sidebar and in `_site/assets/search-index.json`.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branch, commit, and pull request
conventions.

## License

Proprietary unless otherwise stated by the repository owners.
