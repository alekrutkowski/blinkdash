blink_eval_r <- function(code, manifest, data = NULL, state = list()) {
  data_names <- names(manifest$datasets %||% list())
  data_name <- data %||% if (length(data_names)) data_names[[1L]] else NULL
  ds <- if (!is.null(data_name)) (manifest$datasets %||% list())[[data_name]] else NULL
  bd_data <- blink_dataset_as_df(ds)
  env <- new.env(parent = globalenv())
  env$bd_data <- bd_data
  env$bd_state <- state %||% list()
  env$bd_manifest <- manifest
  out <- character()
  value <- NULL
  visible <- FALSE
  err <- NULL
  out <- utils::capture.output({
    tryCatch({
      res <- withVisible(eval(parse(text = code %||% ""), envir = env))
      value <<- res$value
      visible <<- isTRUE(res$visible)
      if (visible) print(value)
    }, error = function(e) {
      err <<- conditionMessage(e)
    })
  }, type = "output")
  list(
    ok = is.null(err),
    error = err,
    output = paste(out, collapse = "\n"),
    visible = visible,
    value = if (is.null(err) && (is.data.frame(value) || is.list(value) || length(value) <= 20)) value else NULL
  )
}

blink_builder_index <- function() {
  blink_read_utf8(blink_pkg_file("builder", "index.html"))
}


blink_as_yaml_text <- function(manifest) {
  yaml::as.yaml(blink_manifest_for_save(manifest), line.sep = "\n")
}

blink_project_dir_from_path <- function(path) {
  path <- normalizePath(path, mustWork = FALSE)
  ext <- tolower(tools::file_ext(path))
  if (dir.exists(path) || !nzchar(ext)) path else dirname(path)
}

blink_write_manifest_as <- function(manifest, path) {
  path <- normalizePath(path, mustWork = FALSE)
  ext <- tolower(tools::file_ext(path))
  if (dir.exists(path) || !nzchar(ext)) {
    return(blink_write_project_files(manifest, path))
  }
  if (!ext %in% c("yml", "yaml", "json")) {
    stop("Save-as path must be a directory or a .yml, .yaml, or .json file.", call. = FALSE)
  }
  dir.create(dirname(path), recursive = TRUE, showWarnings = FALSE)
  blink_write_manifest(manifest, path)
  base <- tools::file_path_sans_ext(path)
  mirror <- if (ext %in% c("yml", "yaml")) paste0(base, ".json") else paste0(base, ".yml")
  blink_write_manifest(manifest, mirror)
  invisible(c(primary = path, mirror = mirror))
}


blink_builder_app <- function(project_dir, data_env = parent.frame()) {
  project_env <- new.env(parent = emptyenv())
  project_env$project_dir <- normalizePath(project_dir, mustWork = FALSE)
  project_env$data_env <- data_env
  www <- blink_pkg_file("builder", "www")

  env_dataset_names <- function() {
    env <- project_env$data_env
    if (is.null(env)) return(character())
    nm <- ls(envir = env, all.names = FALSE)
    nm[vapply(nm, function(x) {
      obj <- get(x, envir = env, inherits = FALSE)
      is.data.frame(obj) || is.matrix(obj)
    }, logical(1L))]
  }

  env_dataset_get <- function(name) {
    env <- project_env$data_env
    if (is.null(env) || !exists(name, envir = env, inherits = FALSE)) {
      stop("R object not found in the run_builder() environment: ", name, call. = FALSE)
    }
    obj <- get(name, envir = env, inherits = FALSE)
    if (is.matrix(obj)) obj <- as.data.frame(obj, stringsAsFactors = FALSE)
    if (!is.data.frame(obj)) stop("R object is not a data.frame or matrix: ", name, call. = FALSE)
    obj
  }

  current_dir <- function() project_env$project_dir
  set_current_dir <- function(path) {
    project_env$project_dir <- normalizePath(blink_project_dir_from_path(path), mustWork = FALSE)
    dir.create(project_env$project_dir, recursive = TRUE, showWarnings = FALSE)
    invisible(project_env$project_dir)
  }

  current_project_payload <- function(manifest = NULL) {
    dir <- current_dir()
    list(
      ok = TRUE,
      projectDir = dir,
      projectFile = blink_find_project_file(dir),
      manifest = manifest %||% blink_read_manifest(dir)
    )
  }

  handle_api <- function(req, path) {
    tryCatch({
      if (path == "/api/project" && identical(req$REQUEST_METHOD, "GET")) {
        return(blink_json_response(current_project_payload()))
      }

      if (path == "/api/registry" && identical(req$REQUEST_METHOD, "GET")) {
        return(blink_json_response(list(ok = TRUE, widgets = widget_registry())))
      }

      if (path == "/api/env-datasets" && identical(req$REQUEST_METHOD, "GET")) {
        return(blink_json_response(list(ok = TRUE, names = as.list(unname(env_dataset_names())))))
      }

      if (path == "/api/manual" && identical(req$REQUEST_METHOD, "GET")) {
        manual <- blink_read_utf8(blink_pkg_file("builder", "manual.md"))
        return(blink_json_response(list(ok = TRUE, markdown = manual)))
      }

      if (path == "/api/open" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        open_path <- payload$path %||% ""
        if (!nzchar(open_path)) stop("Provide a local .yml, .yaml, .json file path, or a project directory.", call. = FALSE)
        manifest <- blink_read_manifest(open_path)
        set_current_dir(open_path)
        return(blink_json_response(current_project_payload(manifest)))
      }

      if (path == "/api/save" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        manifest <- payload$manifest %||% payload
        paths <- blink_write_project_files(manifest, current_dir())
        return(blink_json_response(list(ok = TRUE, projectDir = current_dir(), paths = as.list(paths))))
      }

      if (path == "/api/save-as" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        manifest <- payload$manifest %||% blink_read_manifest(current_dir())
        save_path <- payload$path %||% ""
        if (!nzchar(save_path)) stop("Provide a local save-as path ending in .yml/.yaml/.json, or a directory.", call. = FALSE)
        paths <- blink_write_manifest_as(manifest, save_path)
        set_current_dir(save_path)
        return(blink_json_response(list(ok = TRUE, projectDir = current_dir(), paths = as.list(paths))))
      }

      if (path == "/api/yaml/from-json" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        manifest <- payload$manifest %||% blink_read_manifest(current_dir())
        return(blink_json_response(list(ok = TRUE, yaml = blink_as_yaml_text(manifest))))
      }

      if (path == "/api/yaml/to-json" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        text <- payload$yaml %||% ""
        if (!nzchar(text)) stop("The YAML editor is empty.", call. = FALSE)
        manifest <- yaml::yaml.load(text, eval.expr = FALSE)
        if (!is.list(manifest)) stop("YAML did not parse to a dashboard object.", call. = FALSE)
        return(blink_json_response(list(ok = TRUE, manifest = manifest)))
      }

      if (path == "/api/export" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        manifest <- payload$manifest %||% blink_read_manifest(current_dir())
        out_dir <- payload$outDir %||% file.path(current_dir(), "site")
        include_workflow <- isTRUE(payload$includeWorkflow %||% TRUE)
        if (!is.null(payload$manifest)) blink_write_project_files(manifest, current_dir())
        export_dashboard(manifest, out_dir = out_dir, include_workflow = include_workflow, overwrite = TRUE)
        return(blink_json_response(list(ok = TRUE, outDir = normalizePath(out_dir, mustWork = FALSE))))
      }

      if (path == "/api/eval" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        manifest <- payload$manifest %||% blink_read_manifest(current_dir())
        res <- blink_eval_r(payload$code %||% "", manifest, data = payload$data, state = payload$state %||% list())
        return(blink_json_response(res, status = if (isTRUE(res$ok)) 200L else 400L))
      }

      if (path == "/api/precalculate" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        manifest <- payload$manifest %||% blink_read_manifest(current_dir())
        res <- blink_eval_r(payload$code %||% "", manifest, data = payload$data, state = payload$state %||% list())
        if (!isTRUE(res$ok)) return(blink_json_response(res, status = 400L))
        name <- blink_safe_id(payload$name %||% "derived_data")
        if (is.null(res$value)) stop("The R code did not return a data frame or simple list that can be stored as a dataset.", call. = FALSE)
        manifest$datasets[[name]] <- res$value
        blink_write_project_files(manifest, current_dir())
        return(blink_json_response(list(ok = TRUE, name = name, manifest = manifest, output = res$output)))
      }

      if (path == "/api/import" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        file_path <- payload$path %||% ""
        if (!nzchar(file_path)) stop("Provide a local file path.", call. = FALSE)
        ds <- blink_import_dataset(file_path)
        name <- blink_safe_id(payload$name %||% blink_guess_dataset_name(file_path))
        manifest <- payload$manifest %||% blink_read_manifest(current_dir())
        manifest$datasets[[name]] <- ds
        blink_write_project_files(manifest, current_dir())
        return(blink_json_response(list(ok = TRUE, name = name, rows = NROW(ds), columns = names(as.data.frame(ds)), manifest = manifest)))
      }


      if (path == "/api/import-env" && identical(req$REQUEST_METHOD, "POST")) {
        payload <- blink_read_json_body(req)
        object <- payload$object %||% ""
        if (!nzchar(object)) stop("Choose a data.frame or matrix from the R session.", call. = FALSE)
        ds <- env_dataset_get(object)
        name <- blink_safe_id(payload$name %||% object)
        manifest <- payload$manifest %||% blink_read_manifest(current_dir())
        manifest$datasets[[name]] <- ds
        blink_write_project_files(manifest, current_dir())
        return(blink_json_response(list(ok = TRUE, name = name, rows = NROW(ds), columns = names(as.data.frame(ds)), manifest = manifest)))
      }

      blink_error_response("Unknown API endpoint.", status = 404L)
    }, error = function(e) blink_error_response(conditionMessage(e), status = 500L))
  }

  list(
    call = function(req) {
      path <- URLdecode(req$PATH_INFO %||% "/")
      if (identical(path, "") || identical(path, "/")) {
        return(blink_http_response(blink_builder_index(), type = "text/html; charset=utf-8"))
      }
      if (startsWith(path, "/api/")) return(handle_api(req, path))
      if (startsWith(path, "/assets/")) {
        rel <- sub("^/assets/", "", path)
        if (grepl("(^|/)\\.\\.(/|$)", rel)) return(blink_http_response("Not found", status = 404L))
        return(blink_static_response(file.path(www, rel)))
      }
      blink_http_response("Not found", status = 404L)
    }
  )
}

#' Run the BlinkDash builder
#'
#' Opens a local browser app. The GUI is a self-contained JavaScript application; R runs only as a localhost REST backend for local file import, project saving, snippet execution, R-memory import, and static export.
#'
#' @param project_dir Dashboard project directory.
#' @param port Local port.
#' @param launch.browser Open the builder in the default browser.
#' @param data_env R environment searched for data.frames and matrices when importing from current R memory.
#'
#' @return Runs until the app is stopped. Invisibly returns the local URL when the server exits.
#' @export
run_builder <- function(project_dir = getwd(), port = 3838, launch.browser = TRUE, data_env = parent.frame()) {
  project_dir <- normalizePath(project_dir, mustWork = FALSE)
  dir.create(project_dir, recursive = TRUE, showWarnings = FALSE)
  if (!file.exists(blink_project_yaml_path(project_dir)) && !file.exists(blink_manifest_path(project_dir))) {
    new_dashboard(project_dir, title = basename(project_dir) %||% "BlinkDash", overwrite = FALSE)
  }
  url <- paste0("http://127.0.0.1:", as.integer(port), "/")
  server <- httpuv::startServer("127.0.0.1", as.integer(port), blink_builder_app(project_dir, data_env = data_env))
  on.exit(httpuv::stopServer(server), add = TRUE)
  if (isTRUE(launch.browser)) utils::browseURL(url)
  message("BlinkDash builder: ", url, " . Press Esc or Ctrl+C to stop.")
  repeat httpuv::service(100)
  invisible(url)
}

#' Serve an exported dashboard locally
#'
#' Serves files with the cross-origin isolation headers preferred by webR. GitHub Pages cannot set arbitrary response headers for static files, so webR falls back to its PostMessage channel there.
#'
#' @param path Directory containing an exported dashboard.
#' @param port Local port.
#' @param browse Open the dashboard in the default browser.
#'
#' @return Invisibly returns the server URL.
#' @export
serve_dashboard <- function(path = "site", port = 8080, browse = TRUE) {
  path <- normalizePath(path, mustWork = TRUE)
  url <- paste0("http://127.0.0.1:", as.integer(port), "/")
  app <- list(
    staticPaths = list(
      "/" = httpuv::staticPath(
        path,
        headers = list(
          "Cross-Origin-Opener-Policy" = "same-origin",
          "Cross-Origin-Embedder-Policy" = "require-corp"
        )
      )
    )
  )
  server <- httpuv::startServer("127.0.0.1", as.integer(port), app)
  on.exit(httpuv::stopServer(server), add = TRUE)
  if (isTRUE(browse)) utils::browseURL(url)
  message("Serving ", path, " at ", url, " . Press Esc or Ctrl+C to stop.")
  repeat httpuv::service(100)
  invisible(url)
}
