test_that("registry exposes inputs and outputs", {
  reg <- widget_registry()
  expect_true("selectize" %in% reg$type)
  expect_true("webr" %in% reg$type)
  expect_true("rplot" %in% reg$type)
  expect_true(all(c("type", "role", "description", "sourcePort", "targetPort") %in% names(reg)))
  expect_true(reg$sourcePort[reg$type == "webr"])
  expect_true(reg$targetPort[reg$type == "webr"])
  expect_true(reg$targetPort[reg$type == "rplot"])
})

test_that("registry descriptions cover current widget capabilities", {
  reg <- widget_registry()
  desc <- setNames(reg$description, reg$type)
  expect_match(desc[["number"]], "minimum.*maximum.*step")
  expect_match(desc[["table"]], "CSV download")
  expect_match(desc[["bar"]], "color.*sort.*hover")
  expect_match(desc[["markdown"]], "code.*math.*Mermaid")
})
