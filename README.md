# blinkdash

`blinkdash` is an R package for building fast, static, reactive dashboards that can be deployed as ordinary files to GitHub Pages.

The builder runs in a browser. Its interface is JavaScript. R is used only as a localhost backend while you are building: it reads local files, imports objects from the calling R environment, saves and opens dashboard designs, runs build-time R snippets, and exports a static site.

Exported dashboards do not need R, Shiny, or a server. They are HTML, CSS, JavaScript, and embedded data.

Builder shcreenshot:

<img width="3387" height="2271" alt="image" src="https://github.com/user-attachments/assets/7abf1d23-ac22-4f4d-b9af-c6f39adf9fa7" />

Output screenshot:

<img width="2964" height="2113" alt="image" src="https://github.com/user-attachments/assets/c606cca9-2799-4b58-bd76-560240bd4f8c" />

## Installation

From GitHub:

```r
install.packages("remotes")
remotes::install_github("alekrutkowski/blinkdash")
```

From a local source tarball:

```r
install.packages("path/to/blinkdash_0.7.0.tar.gz", repos = NULL, type = "source")
```

Runtime dependencies are `httpuv`, `jsonlite`, `yaml`, and standard R packages including `tools` and `utils`. The optional `arrow` package enables Parquet and Feather imports.

```r
install.packages("arrow")
```

## Quick start

```r
blinkdash::new_dashboard("iris-dashboard", overwrite = TRUE)
blinkdash::run_builder("iris-dashboard")
```

The builder opens in your browser. Stop the local builder from R with Esc or Ctrl+C.

## Main functions

| Function | Purpose |
|---|---|
| `new_dashboard()` | Create a dashboard project with `dashboard.blink.yml` and a JSON mirror. |
| `run_builder()` | Open the visual browser builder with a local R backend. |
| `export_dashboard()` | Export a static dashboard site. |
| `serve_dashboard()` | Serve an exported dashboard locally, with headers suitable for webR testing. |
| `read_dashboard()` | Read a YAML or JSON dashboard design into R. |
| `write_dashboard()` | Write a dashboard design to YAML and JSON. |
| `widget_registry()` | Return metadata for the available widget types. |

## The design model

A BlinkDash design is a directed graph:

- input widgets are controls, such as selectize inputs, sliders, date ranges, search boxes, and toggles
- output widgets are views, such as metrics, tables, plots, Markdown, HTML, R plot viewers, and webR consoles
- directed arrows describe exactly which inputs affect which outputs
- a webR processor can sit between inputs and outputs, receiving parameters and producing Markdown, HTML, table, or plot results

If an output widget has incoming arrows, only its upstream inputs filter or parameterise it. If there are no arrows, BlinkDash falls back to applying all inputs from the same dataset.

## Builder layout

The builder has three main panes:

1. **Component library** – drag widgets from the shelf onto the canvas.
2. **Graph canvas** – move, resize, align, link, and delete widgets.
3. **Inspector** – edit project settings, selected widget settings, data imports, local R snippets, checks, and links.

Switch between **Visual** and **YAML** views in the top bar. The YAML view edits the same project source used by the visual builder.

## Saving and opening designs

The canonical work-in-progress file is:

```text
dashboard.blink.yml
```

It is human-readable, diffable, and suitable for version control. BlinkDash also writes:

```text
dashboard.blink.json
```

The builder can open `.yml`, `.yaml`, `.json`, or an existing dashboard project directory. **Save as** writes the design under a new file name or into a new project directory.

## Data

A dashboard can embed multiple datasets. Each widget chooses a dataset unless it consumes a webR result through an incoming arrow.

The local file importer supports CSV, TSV/TAB, RDS, RDA/RData, JSON, and, with `arrow` installed, Parquet and Feather.

The R memory importer lists data frames and matrices in the environment from which `run_builder()` was called. Matrices are converted to data frames before embedding.

Unused embedded datasets should be deleted from **Data & R** before export, because they increase the size of both the YAML design and the static dashboard.

## Build-time R snippets

The **Data & R** tab can run local R snippets before export. These snippets run in your R session and receive:

```r
bd_data      # selected dataset as an ordinary R data.frame
bd_state     # named list of input values, when supplied by the builder
bd_manifest  # full dashboard manifest as an R list
```

For example:

```r
aggregate(Petal.Length ~ Species, data = bd_data, FUN = mean)
```

The returned data frame can be saved as a new static dataset.

## webR snippets in exported dashboards

A webR processor runs R in the viewer's browser. It receives:

```r
bd_data    # filtered dataset for this webR widget as a data.frame
bd_state   # named list with all dashboard input states
bd_params  # named list with only upstream linked input values
bd_meta    # list with dataset name and row count
```

The visible webR widget is always a console/debug surface. It does not render HTML, Markdown, tables, or plots itself. Connect it to a Markdown widget, HTML widget, Table widget, or R plot viewer to display its result.

The webR package field is a comma-separated list. Packages are installed in the browser through webR and then attached with `library()`. Package installation can take time on the first dashboard load.

For base R plots, drawing code such as this can be captured:

```r
plot(1:10, 10:1)
```

For ggplot2, lattice, or grid plots, explicitly print the plot object:

```r
library(ggplot2)

p <- ggplot(mpg, aes(cty, hwy)) +
  geom_point() +
  geom_smooth(formula = y ~ x, method = "lm")

print(p)
```

webR plot capture tries the R `grDevices::svg()` device first. If SVG capture is unavailable, it falls back to bitmap capture.

## Markdown and HTML widgets

Markdown widgets render styled dashboard HTML. HTML widgets insert trusted markup directly.

Both widgets can use input placeholders when arrows connect inputs to the widget:

```text
{{species}}
{{param.species}}
```

The placeholder name is the input widget id. Arrays are shown as comma-separated values. Script tags inside HTML widgets are not intentionally executed by the BlinkDash runtime.

## Plots

Native plot widgets are drawn on canvas for fast interaction. Their **SVG** export button generates genuine vector SVG made from SVG primitives. The **PNG** export button exports a bitmap snapshot.

Supported native plot widgets include scatter, line, bar, histogram, box plot, heatmap, and pie/donut. Plot widgets support per-chart palettes, full-screen viewing, and decimal dot or decimal comma formatting.

## Exporting

From R:

```r
blinkdash::export_dashboard(
  "iris-dashboard",
  out_dir = "site",
  include_workflow = TRUE
)
```

From the builder, click **Export site**.

The exported folder contains:

```text
index.html
404.html
.nojekyll
README.md
assets/
data/app-data.js
.github/workflows/pages.yml
```

Commit the exported files to a GitHub Pages repository. User and organization Pages sites commonly use a repository named `username.github.io`. Project sites can publish from the repository root, from `/docs`, or through GitHub Actions, depending on repository settings.

## Local preview

```r
blinkdash::serve_dashboard("site")
```

This serves exported files locally with cross-origin isolation headers preferred by webR. Static hosting platforms that cannot set those headers may use webR's fallback channel.

## Development

Run package checks before releasing:

```r
# from the package root
rcmdcheck::rcmdcheck(args = c("--no-manual"), error_on = "warning")
```

The repository includes GitHub Actions workflows for R package checks and JavaScript syntax checks.

## License

MIT © Alek Rutkowski
