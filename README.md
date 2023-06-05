# Clonernews

Clonernews is a simple news application which consumes the Firebase HackerNews API and displays its contents
in a web user interface.

## How to run

Clone the repository. Make sure that you are inside the project root directory and execute the command "go run main.go". Open up a web browser at "http://localhost:8080" to view the user interface.

## Design

This application incorporates a basic MVC design pattern, with a Go back-end responsible for routing and rendering of
HTML templates, and for injecting the correct Javascript files into the relevant HTML page. All the functionality for
getting data from the HackerNews API and updating the display of the DOM accordingly is written in Javascript.

### Server Back-End

The HTTP server is built with a Go back-end, responsible for hosting and serving the HTML, Javascript
and CSS files which together compose the UI.

A single Go file (./main.go) defines all valid endpoints which return a view, and uses one handler function
(defaultHandler) in tandem with a map (endpointViewMap) to determine which view to render.

### Use of Templates

This application makes use of one Go HTML "layout" template file (./wwwroot/templates/layout.html) which defines
a site-wide layout for the overall structure of the HTML pages which make up the UI.

The "layout" template is parsed along with one of the pages (found in ./wwwroot/pages/), which contains three definitions
for templates which are nested at appropriate points throughout the layout file. Each HTML page contains a definition for
a "title" template; a "content" template, and a "scripts" template.

There is a "Not Found" (./wwwroot/pages/notfound.html) page, which also inherits the layout template, providing a consistent
look and feel to the UI, even if the user navigates to an endpoint which is not defined in the application.

### Javascript API Client

One Javascript file (./wwwroot/js/client.js) defines several asynchronous functions for consuming data from the Firebase HackerNews API. These functions are exported to be made available for use by relevant Javascript modules for each page.

It is within the "scripts" template, defined in each Go HTML page, where the specific script(s) are injected in order to provide its functionality to the user interface.

### CSS

The application makes use of flex in conjunction with custom CSS classes in order to provide a cleaner user interface.
It also contains media queries in order to provide a responsive front-end design, dependent upon the screen and viewport
on which the UI is being looked at.

