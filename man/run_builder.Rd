\name{run_builder}
\alias{run_builder}
\title{Run the BlinkDash builder}
\usage{
run_builder(project_dir = getwd(), port = 3838, launch.browser = TRUE, data_env = parent.frame())
}
\arguments{
\item{project_dir}{Dashboard project directory.}
\item{port}{Local port.}
\item{launch.browser}{Open the builder in the default browser.}
\item{data_env}{R environment searched for data frames and matrices when importing from current R memory.}
}
\value{
Runs until the app is stopped. Invisibly returns the local URL when the server exits.
}
\description{
Opens a local browser app. The GUI is a self-contained JavaScript application; R runs only as a localhost REST backend for local file import, project saving, snippet execution, R-memory import, static export, and compiled-dashboard preview.
}
