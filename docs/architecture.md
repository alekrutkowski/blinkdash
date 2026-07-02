# BlinkDash architecture

## Builder

The builder is a self-contained vanilla JavaScript application served from `inst/builder`. It uses a small `httpuv` server as a local REST backend. The builder path does not depend on Shiny, React, or remote JavaScript libraries.

Core endpoints:

- `GET /api/project` reads `dashboard.blink.yml` or the JSON mirror.
- `POST /api/open` opens a local `.yml`, `.yaml`, `.json`, or project directory.
- `POST /api/save` writes both work-in-progress formats.
- `POST /api/save-as` writes the design under a new local path.
- `POST /api/yaml/from-json` serializes the visual design to YAML.
- `POST /api/yaml/to-json` parses YAML back into the visual design.
- `GET /api/manual` returns the builder manual for the in-app help modal.
- `GET /api/env-datasets` lists data frames and matrices from the R environment supplied to `run_builder()`.
- `POST /api/import-env` imports one of those R objects into the dashboard design.
- `POST /api/import` imports a local data file through R.
- `POST /api/eval` evaluates local R snippets with `bd_data`, `bd_state`, and `bd_manifest`.
- `POST /api/precalculate` saves the result of an R snippet as a static dataset.
- `POST /api/export` writes the static dashboard site.
- `GET /compiled/` serves the latest compiled dashboard from the builder's `site/` folder for local preview.

## Visual graph

The manifest stores `graph.nodes` and `graph.edges`. Nodes correspond to dashboard widgets. Directed edges express reactivity, normally from input nodes to output nodes. A webR node can have both incoming and outgoing edges, so it can receive input state and feed dedicated result widgets.

## Human-readable project format

The canonical work-in-progress file is `dashboard.blink.yml`. A JSON mirror, `dashboard.blink.json`, is written for tooling. The YAML file stores the title, subtitle, theme, decimal format, embedded datasets, widgets, node positions, node sizes, and directed arrows.

## Static runtime

The exported dashboard loads `data/app-data.js` and renders cards with JavaScript. If a graph is present, output components only listen to upstream input components connected by directed edges. If no graph is present, the runtime falls back to dataset-level filtering. Exported cards can be moved by dashboard viewers; positions are stored in the browser's local storage.

Native plots are drawn on canvas for interactive speed. SVG export is generated separately from vector primitives, so exported SVG files are not bitmap wrappers.

Static tables support sorting, paging, table-level search, and CSV download of the currently displayed filtered data. Markdown blocks use the runtime renderer for fenced code blocks, syntax highlighting, GitHub-style math, and diagram fences.

## webR

webR is optional. Static filters, metrics, tables, Markdown, HTML, and native plots do not require webR. webR processors auto-run asynchronously on dashboard load and when their connected inputs change. Hidden webR processors run and can feed dependent widgets while staying out of the visible dashboard.

The visible webR widget is a console/debug surface. Markdown, HTML, table, and plot interpretation is handled by connected output widgets.
