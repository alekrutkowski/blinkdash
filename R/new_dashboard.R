blink_widget_layout_from_node <- function(x, y, width, height) {
  list(
    x = max(1, floor(x / 92) + 1),
    y = max(1, floor(y / 84) + 1),
    w = max(1, min(12, round(width / 92))),
    h = max(1, round(height / 84)),
    px = list(left = x, top = y, width = width, height = height)
  )
}

blink_node <- function(id, role, x, y, width = 250, height = 120) {
  list(
    id = id,
    type = "dashboard",
    role = role,
    position = list(x = x, y = y),
    size = list(width = width, height = height)
  )
}

blink_edge <- function(from, to, label = NULL) {
  list(
    id = paste0("edge_", from, "_", to),
    source = from,
    target = to,
    label = label %||% "filters"
  )
}

blink_default_manifest <- function(title = "Iris Explorer") {
  iris <- get("iris", envir = asNamespace("datasets"))
  iris <- as.data.frame(iris, stringsAsFactors = FALSE)

  nodes <- list(
    blink_node("species", "input", 70, 90, 285, 145),
    blink_node("sepal_range", "input", 70, 270, 285, 130),
    blink_node("row_count", "output", 430, 80, 260, 125),
    blink_node("scatter", "output", 430, 240, 560, 335),
    blink_node("table", "output", 1030, 240, 600, 335),
    blink_node("about", "output", 430, 620, 760, 220)
  )

  node_by_id <- setNames(nodes, vapply(nodes, `[[`, character(1), "id"))
  layout <- function(id) {
    n <- node_by_id[[id]]
    blink_widget_layout_from_node(n$position$x, n$position$y, n$size$width, n$size$height)
  }

  outputs <- c("row_count", "scatter", "table")
  edges <- unlist(lapply(c("species", "sepal_range"), function(src) {
    lapply(outputs, function(tgt) blink_edge(src, tgt, "filter"))
  }), recursive = FALSE)

  list(
    schema = "https://blinkdash.local/schema/v4",
    fileFormat = list(
      name = "BlinkDash YAML",
      version = 4,
      canonical = "dashboard.blink.yml",
      jsonMirror = "dashboard.blink.json"
    ),
    title = title,
    subtitle = "A fast static dashboard with explicit input-to-output wiring. Edit this subtitle in the Project tab or remove it entirely.",
    theme = list(
      name = "aurora",
      builderName = "aurora",
      dashboardName = "aurora",
      font = "Inter",
      plotPalette = "okabe",
      accent = "#4f46e5",
      radius = 18,
      density = "comfortable",
      glass = TRUE
    ),
    format = list(
      decimal = "."
    ),
    datasets = list(iris = iris),
    graph = list(
      direction = "left-to-right",
      canvas = list(width = 1700, height = 1180, grid = 20),
      nodes = nodes,
      edges = edges
    ),
    state = list(),
    builder = list(
      helpDismissed = FALSE
    ),
    widgets = list(
      list(
        id = "species",
        type = "selectize",
        role = "input",
        label = "Species",
        help = "A styled categorical filter for factor or character columns. Here it filters the Species column.",
        data = "iris",
        field = "Species",
        multiple = TRUE,
        default = sort(unique(as.character(iris$Species))),
        layout = layout("species")
      ),
      list(
        id = "sepal_range",
        type = "range",
        role = "input",
        label = "Sepal length",
        help = "A numeric range filter for R numeric/double/integer columns.",
        data = "iris",
        field = "Sepal.Length",
        min = min(iris$Sepal.Length),
        max = max(iris$Sepal.Length),
        step = 0.1,
        default = c(min(iris$Sepal.Length), max(iris$Sepal.Length)),
        layout = layout("sepal_range")
      ),
      list(
        id = "row_count",
        type = "metric",
        role = "output",
        label = "Filtered rows",
        data = "iris",
        measure = list(op = "count"),
        suffix = " flowers",
        layout = layout("row_count")
      ),
      list(
        id = "scatter",
        type = "scatter",
        role = "output",
        title = "Sepal length vs petal length",
        data = "iris",
        x = "Sepal.Length",
        y = "Petal.Length",
        color = "Species",
        palette = "okabe",
        layout = layout("scatter")
      ),
      list(
        id = "table",
        type = "table",
        role = "output",
        title = "Filtered data",
        data = "iris",
        pageSize = 12,
        columns = names(iris),
        layout = layout("table")
      ),
      list(
        id = "about",
        type = "markdown",
        role = "output",
        title = "How this dashboard is wired",
        markdown = paste(
          "### Visual wiring",
          "Drag widgets from the shelf onto the canvas. Draw arrows from inputs to outputs to choose exactly what controls what.",
          "",
          "Open the **Project** tab to change the title, subtitle, badge, theme, font, decimal separator, and footer text.",
          "",
          "Open the **YAML** view to edit the human-readable `dashboard.blink.yml` source directly.",
          sep = "\n"
        ),
        layout = layout("about")
      )
    ),
    snippets = list(
      list(
        id = "summary",
        label = "Summary of current dataset",
        data = "iris",
        code = "summary(bd_data)"
      )
    ),
    export = list(
      rootReady = TRUE,
      includeWorkflow = TRUE,
      showBadge = TRUE,
      badgeText = "static reactive dashboard",
      showGeneratedBy = TRUE,
      generatedBy = "Generated by BlinkDash.",
      webrMjs = "https://webr.r-wasm.org/latest/webr.mjs"
    )
  )
}

#' Create a new dashboard project
#'
#' Creates a project directory with `dashboard.blink.yml` as the human-readable source file and `dashboard.blink.json` as a JSON mirror for tooling.
#'
#' @param path Project directory to create.
#' @param title Dashboard title.
#' @param overwrite Replace existing project files if present.
#'
#' @return The path to `dashboard.blink.yml`, invisibly.
#' @export
new_dashboard <- function(path, title = "Iris Explorer", overwrite = FALSE) {
  if (!is.character(path) || length(path) != 1L) stop("`path` must be a single directory path.", call. = FALSE)
  dir.create(path, recursive = TRUE, showWarnings = FALSE)
  yml <- blink_project_yaml_path(path)
  json <- blink_manifest_path(path)
  if ((file.exists(yml) || file.exists(json)) && !isTRUE(overwrite)) {
    stop("A dashboard project already exists. Use overwrite = TRUE to replace it.", call. = FALSE)
  }
  manifest <- blink_default_manifest(title)
  blink_write_project_files(manifest, path)
  invisible(yml)
}
