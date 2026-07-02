test_that("default dashboard uses the current manifest schema", {
  manifest <- blinkdash:::blink_default_manifest()
  expect_identical(manifest$schema, "https://blinkdash.local/schema/v4")
  expect_identical(manifest$fileFormat$version, 4)
  expect_identical(manifest$theme$builderName, "aurora")
  expect_identical(manifest$theme$dashboardName, "aurora")
  expect_identical(manifest$theme$baseFontSize, 16)
})

test_that("packaged Iris example mirrors the current manifest schema", {
  path <- system.file("examples", "iris-dashboard.json", package = "blinkdash")
  skip_if(!nzchar(path), "Iris example is not installed")
  manifest <- jsonlite::fromJSON(path, simplifyVector = FALSE)
  expect_identical(manifest$schema, "https://blinkdash.local/schema/v4")
  expect_identical(manifest$fileFormat$version, 4L)
  expect_identical(manifest$format$decimal, ".")
  expect_true(any(vapply(manifest$widgets, function(x) identical(x$id, "row_count"), logical(1))))
})
