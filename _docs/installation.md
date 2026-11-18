---
title: Installation
description: Install Ruby dependencies and run DevDocs locally on Windows or Unix.
nav_order: 2
permalink: /docs/installation/
layout: docs
---

## Install Ruby

DevDocs targets **Ruby 3.4.x**. On Windows, [RubyInstaller](https://rubyinstaller.org/)
with the MSYS2 toolchain is the usual path. On macOS or Linux, use the system
package manager or a version manager such as `rbenv`.

After installation, confirm:

```bash
ruby -v
# ruby 3.4.x ...
```

If `ruby` is not found in a new terminal, add the Ruby `bin` directory to your
`PATH`. On this project's Windows setup that is typically `C:\Ruby34-x64\bin`.

## Install Bundler and gems

Bundler resolves versions from the `Gemfile`:

```bash
gem install bundler
bundle install
```

Jekyll `~> 4.4.1` is the primary dependency. On Windows, `tzinfo-data` and
`wdm` are included so timezone data and file watching work correctly.

Gems install into the path Bundler chooses for the current environment. Prefer
`bundle exec ...` so commands always use the locked versions in `Gemfile.lock`.

## Build and serve

Production-style build (writes `_site/`):

```bash
bundle exec jekyll build
```

Development server with live reload of most content changes:

```bash
bundle exec jekyll serve
```

Useful options:

| Flag | Effect |
|------|--------|
| `--livereload` | Refresh the browser when files change |
| `--host 0.0.0.0` | Listen on all interfaces (LAN access) |
| `--baseurl /subdir` | Preview a non-root base path |

## Configuration you should not hardcode

Production `_config.yml` sets `baseurl: "/DevDocs"` for GitHub Pages. Templates
use the `relative_url` filter so CSS, JS, and doc links stay correct under that
prefix. For root-local serving, run:

```bash
bundle exec jekyll serve --config _config.yml,_config.local.yml
```

## Troubleshooting

- **`jekyll` not found** - run via `bundle exec jekyll`, not a global gem alone.
- **Port 4000 in use** - `bundle exec jekyll serve --port 4001`.
- **Native extension errors on Windows** - reinstall Ruby with DevKit/MSYS2 and
  rerun `bundle install`.

When the install is healthy, move on to
[Project Structure]({{ '/docs/project-structure/' | relative_url }}).
