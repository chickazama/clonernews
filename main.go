package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

const (
	addr                  string = ":8080"
	defaultLayoutTemplate string = "layout"
	defaultLayoutPath     string = "./wwwroot/templates/layout.html"
	pagesPath             string = "./wwwroot/pages/"
)

var endpointViewMap map[string]string

func main() {
	initEndpointViewMap()
	// Create ServeMux, serve static files (HTML, CSS, JS, etc.) & handle endpoints
	mux := http.NewServeMux()
	mux.Handle("/wwwroot/", http.StripPrefix("/wwwroot/", http.FileServer(http.Dir("wwwroot/"))))
	mux.HandleFunc("/", defaultHandler)
	// mux.HandleFunc("/topstories", topStoriesHandler)
	// Listen and serve on defined port
	err := http.ListenAndServe(addr, mux)
	// If there is an error with opening server, log and exit with failure status code
	if err != nil {
		log.Fatal(err.Error())
	}
}

func defaultHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL.Path)
	view, exists := endpointViewMap[r.URL.Path]
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		view = endpointViewMap["/notfound"]
	}
	// Evaluate request method - only HTTP GET supported for index
	switch r.Method {
	// HTTP Get returns the home page and Status 200 - OK
	case http.MethodGet:
		// Parse HTML files to populate template
		files := []string{
			defaultLayoutPath,
			view,
		}
		tmpl, err := template.ParseFiles(files...)
		// If there is an error parsing HTML files, return Status 500 - Internal Server Error
		if err != nil {
			log.Println(err.Error())
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		// If there is an error executing layout template, return Status 500 - Internal Server Error
		err = tmpl.ExecuteTemplate(w, defaultLayoutTemplate, nil)
		if err != nil {
			log.Println(err.Error())
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		return
	// Any other HTTP method returns Status 400 - Bad Request
	default:
		badRequestError := fmt.Sprintf("Only %s HTTP methods allowed at endpoint: %s", http.MethodGet, r.URL.Path)
		http.Error(w, badRequestError, http.StatusBadRequest)
		return
	}
}

func initEndpointViewMap() {
	endpointViewMap = make(map[string]string)
	endpointViewMap["/"] = pagesPath + "index.html"
	endpointViewMap["/topstories"] = pagesPath + "topstories.html"
	endpointViewMap["/notfound"] = pagesPath + "notfound.html"
}
