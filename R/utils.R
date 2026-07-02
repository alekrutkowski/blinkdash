`%||%` <- function(x, y) {
  if (is.null(x) || length(x) == 0) y else x
}

blink_pkg_file <- function(...) {
  path <- system.file(..., package = "blinkdash", mustWork = FALSE)
  if (!nzchar(path)) {
    stop("Could not find a package file. Install blinkdash before using this function.", call. = FALSE)
  }
  path
}

blink_write_utf8 <- function(text, path) {
  dir.create(dirname(path), recursive = TRUE, showWarnings = FALSE)
  con <- file(path, open = "w", encoding = "UTF-8")
  on.exit(close(con), add = TRUE)
  writeLines(text, con = con, useBytes = TRUE)
  invisible(path)
}

blink_read_utf8 <- function(path) {
  paste(readLines(path, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
}

blink_escape_html <- function(x) {
  x <- as.character(x %||% "")
  x <- gsub("&", "&amp;", x, fixed = TRUE)
  x <- gsub("<", "&lt;", x, fixed = TRUE)
  x <- gsub(">", "&gt;", x, fixed = TRUE)
  x <- gsub('"', "&quot;", x, fixed = TRUE)
  x <- gsub("'", "&#039;", x, fixed = TRUE)
  x
}

blink_json <- function(x, pretty = FALSE) {
  jsonlite::toJSON(
    x,
    auto_unbox = TRUE,
    dataframe = "rows",
    null = "null",
    na = "null",
    digits = NA,
    pretty = pretty
  )
}

blink_as_rows <- function(x) {
  if (is.data.frame(x)) {
    out <- lapply(seq_len(nrow(x)), function(i) {
      row <- as.list(x[i, , drop = FALSE])
      names(row) <- names(x)
      row
    })
    return(out)
  }
  x
}

blink_dataset_as_df <- function(x) {
  if (is.data.frame(x)) return(x)
  if (is.null(x)) return(data.frame())
  if (is.list(x) && length(x) == 0) return(data.frame())
  jsonlite::fromJSON(jsonlite::toJSON(x, auto_unbox = TRUE, null = "null"), simplifyDataFrame = TRUE)
}

blink_manifest_for_save <- function(manifest) {
  manifest$updated <- format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC")
  manifest$datasets <- lapply(manifest$datasets %||% list(), blink_as_rows)
  manifest
}

blink_project_yaml_path <- function(project_dir) {
  file.path(normalizePath(project_dir, mustWork = FALSE), "dashboard.blink.yml")
}

blink_manifest_path <- function(project_dir) {
  file.path(normalizePath(project_dir, mustWork = FALSE), "dashboard.blink.json")
}

blink_find_project_file <- function(project) {
  path <- normalizePath(project, mustWork = FALSE)
  if (dir.exists(path)) {
    candidates <- file.path(path, c("dashboard.blink.yml", "dashboard.blink.yaml", "dashboard.blink.json"))
    hit <- candidates[file.exists(candidates)]
    if (!length(hit)) return(file.path(path, "dashboard.blink.yml"))
    return(hit[[1L]])
  }
  path
}

blink_read_manifest <- function(project) {
  if (is.list(project)) return(project)
  if (!is.character(project) || length(project) != 1L) {
    stop("`project` must be a manifest list, a manifest file, or a project directory.", call. = FALSE)
  }
  path <- blink_find_project_file(project)
  if (!file.exists(path)) stop("Dashboard project file not found: ", path, call. = FALSE)
  ext <- tolower(tools::file_ext(path))
  manifest <- if (ext %in% c("yml", "yaml")) {
    yaml::read_yaml(path, eval.expr = FALSE)
  } else {
    jsonlite::fromJSON(path, simplifyVector = FALSE)
  }
  manifest
}

blink_write_manifest <- function(manifest, path) {
  dir.create(dirname(path), recursive = TRUE, showWarnings = FALSE)
  manifest <- blink_manifest_for_save(manifest)
  ext <- tolower(tools::file_ext(path))
  if (ext %in% c("yml", "yaml")) {
    yaml::write_yaml(manifest, path)
  } else {
    jsonlite::write_json(
      manifest,
      path = path,
      auto_unbox = TRUE,
      dataframe = "rows",
      null = "null",
      na = "null",
      pretty = TRUE
    )
  }
  invisible(path)
}

blink_write_project_files <- function(manifest, project_dir) {
  project_dir <- normalizePath(project_dir, mustWork = FALSE)
  dir.create(project_dir, recursive = TRUE, showWarnings = FALSE)
  yml <- blink_project_yaml_path(project_dir)
  json <- blink_manifest_path(project_dir)
  blink_write_manifest(manifest, yml)
  blink_write_manifest(manifest, json)
  invisible(c(yml = yml, json = json))
}

#' Read a BlinkDash project
#'
#' @param project Project directory or `dashboard.blink.yml`/`dashboard.blink.json` file.
#'
#' @return A dashboard manifest list.
#' @export
read_dashboard <- function(project) {
  blink_read_manifest(project)
}

#' Write a BlinkDash project
#'
#' Writes both the human-readable YAML project file and a JSON mirror.
#'
#' @param manifest Dashboard manifest list.
#' @param project_dir Project directory.
#'
#' @return Paths to the written files, invisibly.
#' @export
write_dashboard <- function(manifest, project_dir) {
  blink_write_project_files(manifest, project_dir)
}

blink_safe_id <- function(x) {
  x <- gsub("[^A-Za-z0-9_-]+", "-", x)
  x <- gsub("(^-+|-+$)", "", x)
  if (!nzchar(x)) "dashboard" else tolower(x)
}

blink_copy_dir_contents <- function(from, to) {
  dir.create(to, recursive = TRUE, showWarnings = FALSE)
  files <- list.files(from, all.files = TRUE, no.. = TRUE, full.names = TRUE)
  if (!length(files)) return(invisible(character()))
  ok <- file.copy(files, to, overwrite = TRUE, recursive = TRUE, copy.date = FALSE)
  if (!all(ok)) warning("Some asset files could not be copied.", call. = FALSE)
  invisible(file.path(to, basename(files)))
}

blink_content_type <- function(path) {
  ext <- tolower(tools::file_ext(path))
  switch(
    ext,
    html = "text/html; charset=utf-8",
    css = "text/css; charset=utf-8",
    js = "application/javascript; charset=utf-8",
    json = "application/json; charset=utf-8",
    svg = "image/svg+xml",
    png = "image/png",
    jpg = "image/jpeg",
    jpeg = "image/jpeg",
    webp = "image/webp",
    "text/plain; charset=utf-8"
  )
}

blink_http_response <- function(body = "", status = 200L, type = "text/plain; charset=utf-8", headers = list()) {
  list(
    status = as.integer(status),
    headers = c(list("Content-Type" = type, "Cache-Control" = "no-store"), headers),
    body = body
  )
}

blink_json_response <- function(x, status = 200L) {
  blink_http_response(blink_json(x), status = status, type = "application/json; charset=utf-8")
}

blink_error_response <- function(message, status = 400L) {
  blink_json_response(list(ok = FALSE, error = as.character(message)), status = status)
}

blink_read_request_body <- function(req) {
  input <- req$rook.input
  if (is.null(input)) return("")
  chunks <- raw()
  repeat {
    chunk <- input$read()
    if (is.null(chunk) || !length(chunk)) break
    chunks <- c(chunks, chunk)
  }
  if (!length(chunks)) "" else rawToChar(chunks)
}

blink_read_json_body <- function(req) {
  txt <- blink_read_request_body(req)
  if (!nzchar(txt)) return(list())
  jsonlite::fromJSON(txt, simplifyVector = FALSE)
}

blink_static_response <- function(path, headers = list()) {
  if (!file.exists(path) || dir.exists(path)) return(blink_http_response("Not found", status = 404L))
  body <- readBin(path, what = "raw", n = file.info(path)$size)
  blink_http_response(body = body, status = 200L, type = blink_content_type(path), headers = headers)
}

blink_guess_dataset_name <- function(path) {
  blink_safe_id(tools::file_path_sans_ext(basename(path)))
}

blink_import_dataset <- function(path) {
  path <- normalizePath(path, mustWork = TRUE)
  ext <- tolower(tools::file_ext(path))
  if (ext %in% c("csv", "txt")) {
    return(utils::read.csv(path, stringsAsFactors = FALSE, check.names = FALSE))
  }
  if (ext %in% c("tsv", "tab")) {
    return(utils::read.delim(path, stringsAsFactors = FALSE, check.names = FALSE))
  }
  if (ext %in% c("rds", "rda", "rdata")) {
    if (ext == "rds") return(readRDS(path))
    env <- new.env(parent = emptyenv())
    nm <- load(path, envir = env)
    return(get(nm[[1L]], envir = env))
  }
  if (ext == "json") {
    return(jsonlite::fromJSON(path, simplifyDataFrame = TRUE))
  }
  if (ext %in% c("parquet", "feather", "arrow")) {
    if (!requireNamespace("arrow", quietly = TRUE)) stop("Install the arrow package to import Parquet or Feather files.", call. = FALSE)
    if (ext == "parquet") return(as.data.frame(arrow::read_parquet(path)))
    return(as.data.frame(arrow::read_feather(path)))
  }
  stop("Unsupported file type: .", ext, call. = FALSE)
}
