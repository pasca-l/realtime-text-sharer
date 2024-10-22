package server

import (
	"net/http"

	"golang.org/x/net/websocket"
)

func Serve() error {
	http.Handle("/", MiddlewareWrapper(rootHandler))
	http.Handle("/ws", websocket.Handler(webSocketHandler))

	server := http.Server{
		Addr:    ":8080",
		Handler: nil,
	}
	err := server.ListenAndServe()
	if err != nil {
		return err
	}

	return nil
}
