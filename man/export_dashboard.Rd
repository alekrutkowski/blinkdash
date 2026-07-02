\name{export_dashboard}
\alias{export_dashboard}
\title{Export a static dashboard}
\usage{
export_dashboard(project, out_dir = "site", include_workflow = TRUE, overwrite = TRUE)
}
\arguments{
\item{project}{A manifest list, a \code{dashboard.blink.yml}/\code{dashboard.blink.json} file, or a dashboard project directory.}
\item{out_dir}{Output directory. For a GitHub Pages user or organization site, this can be the repository root of a \code{username.github.io} repository.}
\item{include_workflow}{Whether to include a GitHub Pages workflow in the exported site.}
\item{overwrite}{Whether to overwrite generated files in \code{out_dir}.}
}
\value{
The output directory, invisibly.
}
\description{
Exports HTML, CSS, JavaScript, embedded data, and optional GitHub Pages deployment metadata for a static dashboard.
}
