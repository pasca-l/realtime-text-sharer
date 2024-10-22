package main

import (
	"log"

	"github.com/pasca-l/realtime-text-sharer/server"
)

func main() {
	log.Println("starting websocket server!")

	err := server.Serve()
	if err != nil {
		log.Fatal(err)
	}
}
