package server

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/pasca-l/realtime-text-sharer/domain"
	"golang.org/x/net/websocket"
)

// globally initialize managers
var socketManger = domain.NewSocketManager()
var roomManager = domain.NewRoomManager()

func rootHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello from websocket server, using http!"))
}

func webSocketHandler(ws *websocket.Conn) {
	defer ws.Close()

	clientId, err := uuid.NewV7()
	if err != nil {
		log.Println("could not generate UUIDv7")
		return
	}

	for {
		// receive incoming messages
		var msg domain.Message
		err := websocket.JSON.Receive(ws, &msg)
		if err != nil {
			log.Println("error receiving message: ", err)
			break
		}

		// execute command
		switch cmd := msg.Command; cmd {
		case "add":
			err := socketManger.AppendSocket(ws, clientId, msg.RoomId)
			if err != nil {
				log.Println("error appending socket: ", err)
			}
			err = roomManager.AddRoom(msg.RoomId)
			if err != nil {
				log.Println("error adding room: ", err)
			}

		case "delete":
			err := socketManger.RemoveSocket(clientId, msg.RoomId)
			if err != nil {
				log.Println("error removing socket: ", err)
			}
			// if no sockets are connected to the room
			if len(socketManger.Sockets[msg.RoomId]) == 0 {
				err = roomManager.DeleteRoom(msg.RoomId)
				if err != nil {
					log.Println("error deleting room: ", err)
				}
			}

		case "get":
			err := socketManger.AppendSocket(ws, clientId, msg.RoomId)
			if err != nil {
				log.Println("error appending socket: ", err)
			}
			res, err := roomManager.GetContentFromRoom(msg.RoomId)
			if err != nil {
				log.Println("error getting room content: ", err)
			}
			err = socketManger.Unicast(clientId, msg.RoomId, res)
			if err != nil {
				log.Println("error unicasting to socket: ", err)
			}

		case "update":
			res, err := roomManager.UpdateContentAtRoom(msg.RoomId, msg.Content)
			if err != nil {
				log.Println("error updating room content, ", err)
			}
			err = socketManger.Broadcast(msg.RoomId, res)
			if err != nil {
				log.Println("error broadcasting to sockets: ", err)
			}

		default:
			log.Println("unexpected command: ", cmd)
		}
	}
}
