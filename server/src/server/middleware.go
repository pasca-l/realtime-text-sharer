package server

import (
	"net/http"
)

func MiddlewareWrapper(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		middlewareCORS(http.HandlerFunc(fn)).ServeHTTP(w, r)
	}
}

func middlewareCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		h.ServeHTTP(w, r)
	})
}
