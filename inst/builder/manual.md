# BlinkDash Builder Manual

BlinkDash builds static, reactive JavaScript dashboards from a visual graph. The local R session is only used while you are building: it reads local files, imports objects already present in R memory, saves the design, runs pre-calculation snippets, and exports the static site. The exported dashboard is a folder of ordinary files that can be committed to GitHub Pages.

## Builder layout

The builder has three main panes:

1. **Component library** on the left – drag widgets from here.
2. **Dashboard graph** in the centre – this is the visual canvas. Widgets are cards. Arrows define dependencies.
3. **Inspector** on the right – edit project settings, the selected widget, data imports, R snippets, and checks. Drag the thin handle between the canvas and the inspector to resize it horizontally.

The top bar switches between **Visual** and **YAML** views. The YAML view is the human-readable source editor for the same dashboard.

## Visual graph workflow

Drag a widget from the component library to the canvas. Move it by dragging the card header. Resize it by dragging the bottom-right corner. Hold **Ctrl** while moving or resizing to snap to the grid.

Input widgets have a right-side source handle. Output widgets have a left-side target handle. The webR processor has both: it can receive inputs and send its result to other outputs. Draw a directed arrow from a source handle to a target handle to link components.

If an output has incoming arrows, only upstream inputs affect it. If a dashboard has no graph, BlinkDash falls back to applying all inputs from the same dataset. Explicit wiring is preferred because it is easier to inspect and debug.

Click an arrow to select it. The two linked widgets are highlighted. Delete selected links in the **Links** section of the inspector.

## Cleaning and alignment

Use **Clear canvas** to remove all widgets and arrows while keeping embedded datasets, themes, and project settings.

Use **Auto-align** to place inputs in a left column and outputs in right-side columns. This is useful after experimentation or after importing a design that needs tidying.

Undo and redo are available as toolbar buttons and with **Ctrl+Z** and **Ctrl+Y**.

## Saving, opening, previewing, and exporting

The main project file is:

```text
dashboard.blink.yml
```

This YAML file is human-readable, diffable, and appropriate for version control. BlinkDash also writes a JSON mirror:

```text
dashboard.blink.json
```

Use **Open** or **Open design** to load a `.yml`, `.yaml`, `.json`, or project directory. Use **Import design file from browser** to choose a YAML or JSON file using a harmonised file picker. Use **Save as** to write the same design under a new YAML or JSON file name, or into a new project directory.

Use **Compile and view** in the top bar to export the current design into `site/` and open the compiled dashboard in a new browser page served from `/compiled/`. This preview uses the same static dashboard files as **Export site** and omits the optional GitHub Pages workflow.

Use **Export site** to write deployment-ready files under `site/`. When workflow generation is enabled, the exported folder includes `.github/workflows/pages.yml` for GitHub Pages deployment.

## YAML view

The YAML view contains a syntax-highlighted source editor and a collapsible outline. Use the outline to hide or show nested sections such as `theme`, `datasets`, `widgets`, and `graph.edges`.

Use:

- **Refresh from design** to serialize the visual graph into YAML.
- **Apply YAML to design** to parse the edited YAML back into the visual builder.
- **Save YAML** to write both the YAML and JSON mirror to disk.

The YAML stores the dashboard title, subtitle, themes, fonts, base font size, decimal formatting, export badge/footer text, embedded datasets, widgets, canvas positions, sizes, and arrows.

## Datasets

A BlinkDash design can embed **multiple datasets**. Each widget chooses a dataset in the inspector, unless it consumes a webR result through an incoming arrow.

The **Embedded datasets** section in **Data & R** lists every dataset written into the design and exported site. Use its **Delete** button to remove unused or obsolete datasets before saving or exporting. This keeps `dashboard.blink.yml` and the static dashboard smaller. If a deleted dataset is currently selected by widgets, BlinkDash asks for confirmation and moves those widgets to another available dataset when possible.

### Import from disk

In **Data & R**, the local file path importer supports:

- `.csv` and `.txt`, read with `utils::read.csv()`
- `.tsv` and `.tab`, read with `utils::read.delim()`
- `.rds`, `.rda`, and `.RData`
- `.json`, read with `jsonlite::fromJSON()`
- `.parquet`, `.feather`, and `.arrow` when the R package `arrow` is installed

### Import from current R memory

The builder can list data frames and matrices in the R environment from which `run_builder()` was called. Use **Refresh R objects**, choose an object, and click **Import R object**. Matrices are converted to data frames before embedding.

## Local R snippets and `bd_data`

The local R editor in **Data & R** is for build-time pre-calculation. It runs in your local R session, not in the exported dashboard. It exposes:

```r
bd_data      # selected dataset as an ordinary R data.frame
bd_state     # named list of input values, when supplied by the builder
bd_manifest  # the full dashboard manifest as an R list
```

For example:

```r
summary(bd_data)
head(bd_data)
```

When you click **Save result as dataset**, the returned value is embedded as static data. This is the preferred approach for heavy transformations that do not need to run in the viewer's browser.

## Column-type expectations

Categorical inputs such as select, selectize, multiselect, checkbox, and radio are intended for factor columns, character columns, or integer-coded categories.

Numeric inputs such as slider, range, number filter, histogram, scatter axes, bar measures, and metric measures expect R integer, numeric, double, or float-like columns. Slider and range controls share the same ruler styling, with the range filter using two draggable pointers for lower and upper bounds. Number filters expose **minimum**, **maximum**, and **step** in the inspector, and those settings are written into the exported numeric input. Mouse-wheel changes inside number filter fields step the numeric value without also scrolling the dashboard page.

Date and date range inputs expect date-like values. `YYYY-MM-DD` strings are safest.

Toggle is intended for Boolean/logical columns. It filters rows where the selected field is TRUE or FALSE.

Search can scan all columns when the field is `*`, or one selected column.

## Markdown and HTML widgets

Markdown widgets render styled dashboard HTML. Markdown supports fenced code blocks with syntax highlighting, GitHub-style math expressions, fenced `math` blocks, and diagram blocks such as `mermaid`, `geojson`, `topojson`, and `stl`. The builder inspector includes a **Soft wrap code editor** toggle for Markdown widgets, on by default.

HTML widgets insert trusted markup directly. Script tags inside an HTML widget are not intentionally executed by the BlinkDash runtime, and inline JavaScript event handlers are discouraged because they are browser-dependent and hard to make reproducible. HTML widgets include the same **Soft wrap code editor** toggle in the builder.

Both widgets can use upstream input parameters when arrows connect inputs to the widget. Use either syntax:

```text
{{species}}
{{param.species}}
```

The placeholder name is the input widget id. Arrays are shown as comma-separated values.

## webR processor and result widgets

The webR processor runs R in the viewer's browser. It runs asynchronously and does not block normal JavaScript interactivity. By default it auto-runs after the dashboard opens and after upstream linked inputs change. Dependent output widgets show a spinner while waiting.

A webR processor receives:

```r
bd_data    # data.frame with rows filtered by upstream linked inputs
bd_state   # named R list with all dashboard input states
bd_params  # named R list with only upstream linked input values
bd_meta    # list with data name and row count
```

The **Packages, comma-separated** field asks webR to install and attach those packages before running the snippet. For example, entering `ggplot2, dplyr` makes the bridge call `webR.installPackages(["ggplot2", "dplyr"])` and then attach the packages with `library()`. This works for packages available from the webR WebAssembly binary repository. The field is saved as the webR widget property `packages` in `dashboard.blink.yml`, so it persists after saving, reopening, and exporting. Installing packages happens in the viewer's browser and may take time on the first dashboard load.

It can return:

- a text string
- a Markdown string
- an HTML string
- a data.frame, data.table-like object, or list of rows rendered as a table
- a plot, preferably captured as SVG

For base R plots, code such as `plot(1:10, 10:1)` is enough because it draws directly on the active graphics device. For ggplot2, lattice, and grid plots, create the plot object and explicitly print it, so the SVG graphics device receives drawing commands:

```r
library(ggplot2)
p <- ggplot(mpg, aes(cty, hwy)) +
  # to create a scatterplot
  geom_point() +
  # to fit and overlay a linear trendline
  geom_smooth(formula = y ~ x, method = "lm")
print(p)
```

Package installation in webR can take a noticeable time on the first run, especially for larger packages such as `ggplot2`. The dashboard spinner and the visible webR console are there so the viewer can see that work is in progress.

To use webR as a hidden calculation node, set **Visible in exported dashboard** to off. The node runs and can feed Markdown, HTML, Table, or R plot viewer widgets through arrows.

The visible webR card shows console/debug output. It does not render HTML, Markdown, tables, or plots by itself; those results are interpreted by connected output widgets. The console can use a light or dark output mode. The builder inspector includes a **Soft wrap code editor** toggle for the webR code editor, on by default.

## Plot widgets

Each plot can use its own palette. The global default palette is in the Project tab, and each chart can override it in the Component tab. Palettes include Okabe Ito, Tableau, Observable, Tol, Paired, Dark 24, Viridis, Magma, Plasma, Turbo, Solar, Pastel, and others.

Scatter, line, histogram, bar, box plot, heatmap, and pie charts include horizontal scale or category labels where appropriate. Scatter and line plots show a legend when a color field is selected in both the normal card and full-screen view. Histogram bars touch because bins share boundaries.

Bar, heatmap, pie, and metric aggregates include count, sum, mean, median, minimum, maximum, quartiles, quintiles, and deciles. Bar charts can use one color for all bars or different colors by category, can keep the X-category order or sort by value increasing or decreasing, and can show values on hover. Histograms allow a reasonable number of bins from 2 to 120.

Table widgets include **Download CSV** for the currently filtered table data, including table search and sort choices. Native plots and R plot viewers include **Full screen**, **SVG**, and **PNG** buttons. Native charts are drawn on canvas for fast on-screen interaction, and the **SVG** button generates vector SVG made from SVG primitives. webR plot output first tries the R `grDevices::svg()` device and reads the generated SVG from the webR virtual filesystem; if that fails, BlinkDash falls back to PNG bitmap capture.

## Themes, fonts, and decimals

The Project tab controls the builder theme, exported dashboard theme, font, exported dashboard base font size, default plot palette, decimal separator, title badge, and generated-by footer. Built-in themes include light options such as Aurora, Paper, Berry, Slate, Mint, Sand, Ocean, and Lavender, plus dark options such as Graphite, Midnight, Forest, Dusk, Ember, Lagoon, and Grape.

Fonts are loaded from Google Fonts when the viewer is online, with system font fallbacks otherwise. The base font size is written into the exported dashboard CSS and scales widget text consistently, including controls, table text, metric values, plot labels, legends, tooltips, Markdown, HTML, and SVG export text. Decimal dot or decimal comma affects numeric display in controls, metrics, and plot axes.

## Exported dashboard behaviour

The exported dashboard contains `index.html`, `assets/`, `data/app-data.js`, `.nojekyll`, and an optional GitHub Pages workflow. It does not need R, Shiny, or a server. When the design uses exact builder positions, the exported page trims the leading canvas gutter so widgets start close to the left edge while keeping their relative layout.

Dashboard viewers can move cards. Their positions are stored in browser local storage for that viewer only. The published dashboard files are not modified.
