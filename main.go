package main

import (
	"fmt"
	"net/http"
)

func main() {
	// Create ServeMux, serve static files (HTML, CSS, JS, etc.) & handle endpoints
	mux := http.NewServeMux()
	mux.Handle("/wwwroot/", http.StripPrefix("/wwwroot/", http.FileServer(http.Dir("wwwroot/"))))
	mux.HandleFunc("/", indexHandler)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	// Restrict global pattern to root (index) endpoint
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	// Evaluate request method - only HTTP GET supported for index
	switch r.Method {
	case http.MethodGet:
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Success"))
		return
	default:
		badRequestError := fmt.Sprintf("Only %s HTTP methods allowed at endpoint: %s", http.MethodGet, r.URL.Path)
		http.Error(w, badRequestError, http.StatusBadRequest)
		return
	}
}
