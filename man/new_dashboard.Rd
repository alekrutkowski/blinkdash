\name{new_dashboard}
\alias{new_dashboard}
\title{Create a new dashboard project}
\usage{
new_dashboard(path, title = "Iris Explorer", overwrite = FALSE)
}
\arguments{
\item{path}{Project directory to create.}
\item{title}{Dashboard title.}
\item{overwrite}{Replace existing project files if present.}
}
\value{
The path to \code{dashboard.blink.yml}, invisibly.
}
\description{
Creates a project directory with \code{dashboard.blink.yml} as the human-readable source file and \code{dashboard.blink.json} as a JSON mirror.
}
