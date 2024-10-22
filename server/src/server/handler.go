package server

import (
	"fmt"
	"log"
	"net/http"

	"golang.org/x/net/websocket"
)

func rootHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello from websocket server, using http!"))
}

func webSocketHandler(ws *websocket.Conn) {
	defer ws.Close()

	err := websocket.Message.Send(ws, "hello from websocket server!")
	if err != nil {
		log.Println("error sending message: ", err)
	}

	for {
		var msg string
		err := websocket.Message.Receive(ws, &msg)
		if err != nil {
			log.Println("error receiving message: ", err)
		}

		err = websocket.Message.Send(ws, fmt.Sprintf("'%s' received at server!", msg))
		if err != nil {
			log.Println("error sending message: ", err)
		}
	}
}
