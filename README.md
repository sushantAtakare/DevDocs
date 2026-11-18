# DevDocs

Developer Documentation & Static Website Platform

DevDocs is a Jekyll-based documentation website for publishing technical guides,
API-oriented knowledge, and project references as a fast static site. Content is
written in Markdown, organized with a documentation collection, and rendered
through Liquid layouts with a custom (theme-free) UI.

**Production site:** [https://sushantAtakare.github.io/DevDocs/](https://sushantAtakare.github.io/DevDocs/)

## Features

- Clean homepage introducing the platform
- Documentation collection under `_docs/` with ordered sidebar navigation
- Previous / next paging across guides
- Client-side documentation search (no backend required)
- Responsive layout with accessible header and docs sidebar toggles
- Portable asset URLs via `relative_url` (works with the `/DevDocs` baseurl)
- GitHub Actions CI build + GitHub Pages deployment from `main`

## Technology stack

| Layer | Choice |
|-------|--------|
| Static site generator | Jekyll 4.4.1 |
| Runtime for builds | Ruby 3.4.12 |
| Templates | Liquid |
| Content | Markdown + YAML front matter |
| Markup / style / behavior | HTML5, CSS3, vanilla JavaScript |
| CI/CD | GitHub Actions → GitHub Pages |

No prebuilt Jekyll theme and no large client-side search framework are used.

## Prerequisites

- Ruby **3.4.12** (or compatible 3.4.x)
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
`Gemfile.lock` includes both Windows and Linux platforms so local and CI installs match.

## Local development

Production `_config.yml` sets:

```yaml
url: "https://sushantAtakare.github.io"
baseurl: "/DevDocs"
```

### Option A — match production paths (recommended for deploy checks)

```bash
bundle exec jekyll serve
```

Open [http://127.0.0.1:4000/DevDocs/](http://127.0.0.1:4000/DevDocs/).

### Option B — serve at site root (convenient day-to-day)

```bash
bundle exec jekyll serve --config _config.yml,_config.local.yml
```

Open [http://127.0.0.1:4000/](http://127.0.0.1:4000/).

Useful options:

```bash
bundle exec jekyll serve --livereload
bundle exec jekyll serve --port 4001
```

After changing `_config.yml`, restart the server so collections and defaults reload.

Documentation entry (with production baseurl):

- [http://127.0.0.1:4000/DevDocs/docs/getting-started/](http://127.0.0.1:4000/DevDocs/docs/getting-started/)

## Build instructions

Production-style build (includes `/DevDocs` in asset and doc URLs):

```bash
bundle exec jekyll build
```

Root-local build:

```bash
bundle exec jekyll build --config _config.yml,_config.local.yml
```

Verify:

- `_site/index.html` exists
- `_site/assets/search-index.json` exists and lists all documentation pages
- CSS/JS hrefs include `/DevDocs` when building with production config

The `_site/` directory is build output only and is ignored by git.

## GitHub Pages deployment

DevDocs is configured as a **GitHub Pages project site**:

| Setting | Value |
|---------|-------|
| `url` | `https://sushantAtakare.github.io` |
| `baseurl` | `/DevDocs` |
| Expected URL | https://sushantAtakare.github.io/DevDocs/ |

`relative_url` in layouts/includes prefixes links, CSS, JavaScript, documentation
paths, and the search index URL with `/DevDocs`, so the site works under that
subpath.

### Repository / Pages setup (one-time in GitHub UI)

1. Open the repository **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Ensure the default branch strategy matches this project: production deploys
   from **`main`** via `.github/workflows/deploy.yml`.

Deployment does **not** happen from this chat or from `sushant_dev` alone.
A successful GitHub Actions run on `main` is required before the live site updates.

## CI/CD workflow

Workflow file: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

### What runs when

| Event | Build + validate | Deploy to Pages |
|-------|------------------|-----------------|
| Push to any branch | Yes | Only if the branch is `main` |
| Pull request targeting `main` | Yes | No |
| Manual **Run workflow** (`workflow_dispatch`) | Yes | No (deploy is push-to-`main` only) |

### Jobs

1. **Build site** (`ubuntu-latest`)
   - Checkout the repository
   - Set up Ruby **3.4.12** with Bundler caching
   - Configure Pages
   - `JEKYLL_ENV=production bundle exec jekyll build`
   - Validate `_site`, eight docs pages, search index, and baseurl paths
   - Upload `_site` as a GitHub Pages artifact
2. **Deploy to GitHub Pages**
   - Runs only on **push** to **`main`**
   - Requires a successful build
   - Uses `actions/deploy-pages` with the `github-pages` environment

### How to run the workflow manually

1. Open the repository on GitHub → **Actions**.
2. Select **Build and Deploy**.
3. Click **Run workflow**, choose the branch, and run it.
4. Inspect the **Build site** job logs. Remember: manual runs validate/build;
   production publish still requires a push to `main`.

### How pull requests are validated

PRs that target `main` trigger the **Build site** job. Reviewers can confirm the
Jekyll build and validation steps pass before merge. The deploy job is skipped
for pull requests.

## Project structure

```text
DevDocs/
├── .github/workflows/deploy.yml  # CI build + Pages deploy
├── Gemfile / Gemfile.lock        # Jekyll + cross-platform lock
├── _config.yml                   # Production url/baseurl + site config
├── _config.local.yml             # Optional local root overrides
├── index.md                      # Homepage
├── docs/index.md                 # Docs entry page
├── _docs/                        # Documentation collection source
├── _layouts/                     # default, home, docs
├── _includes/                    # header, footer, sidebar, search UI
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── js/search.js
│   └── search-index.json
├── README.md
├── CONTRIBUTING.md
└── _site/                        # Generated output (not edited by hand)
```

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
