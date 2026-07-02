\name{serve_dashboard}
\alias{serve_dashboard}
\title{Serve an exported dashboard locally}
\usage{
serve_dashboard(path = "site", port = 8080, browse = TRUE)
}
\arguments{
\item{path}{Directory containing an exported dashboard.}
\item{port}{Local port.}
\item{browse}{Open the dashboard in the default browser.}
}
\value{
Invisibly returns the server URL.
}
\description{
Serves exported dashboard files locally with cross-origin isolation headers preferred by webR.
}
