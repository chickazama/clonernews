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
)

func main() {
	// Create ServeMux, serve static files (HTML, CSS, JS, etc.) & handle endpoints
	mux := http.NewServeMux()
	mux.Handle("/wwwroot/", http.StripPrefix("/wwwroot/", http.FileServer(http.Dir("wwwroot/"))))
	mux.HandleFunc("/", indexHandler)
	// Listen and serve on defined port
	err := http.ListenAndServe(addr, mux)
	// If there is an error with opening server, log and exit with failure status code
	if err != nil {
		log.Fatal(err.Error())
	}
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	// Restrict global pattern to root (index) endpoint
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	// Evaluate request method - only HTTP GET supported for index
	switch r.Method {
	// HTTP Get returns the home page and Status 200 - OK
	case http.MethodGet:
		// Parse HTML files to populate template
		files := []string{
			defaultLayoutPath,
			"./wwwroot/pages/index.html",
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
