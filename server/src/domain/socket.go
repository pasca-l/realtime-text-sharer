package domain

import (
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/net/websocket"
)

type Socket struct {
	Uuid uuid.UUID
	Conn *websocket.Conn
}

type SocketManager struct {
	Sockets map[string][]Socket
}

func NewSocketManager() SocketManager {
	return SocketManager{
		Sockets: make(map[string][]Socket),
	}
}

func (sm *SocketManager) AppendSocket(ws *websocket.Conn, clientId uuid.UUID, roomId string) error {
	for _, socket := range sm.Sockets[roomId] {
		if socket.Uuid == clientId {
			return fmt.Errorf("already have socket with uuid %s", clientId)
		}
	}
	sm.Sockets[roomId] = append(sm.Sockets[roomId], Socket{
		Uuid: clientId,
		Conn: ws,
	})
	return nil
}

func (sm *SocketManager) RemoveSocket(clientId uuid.UUID, roomId string) error {
	for idx, socket := range sm.Sockets[roomId] {
		if socket.Uuid == clientId {
			sm.Sockets[roomId] = append(
				sm.Sockets[roomId][:idx],
				sm.Sockets[roomId][idx+1:]...,
			)
		}
	}
	return fmt.Errorf("could not find socket with uuid %s to remove", clientId)
}

func (sm SocketManager) getSocketById(uuid uuid.UUID, roomId string) (Socket, error) {
	for _, socket := range sm.Sockets[roomId] {
		if socket.Uuid == uuid {
			return socket, nil
		}
	}
	return Socket{}, fmt.Errorf("cannot find socket with uuid %s", uuid)
}

func (sm SocketManager) Unicast(clientId uuid.UUID, roomId string, content string) error {
	socket, err := sm.getSocketById(clientId, roomId)
	if err != nil {
		return err
	}
	err = websocket.Message.Send(socket.Conn, content)
	if err != nil {
		return fmt.Errorf("error unicasting message: ", err)
	}
	return nil
}

func (sm SocketManager) Broadcast(roomId string, content string) error {
	for _, socket := range sm.Sockets[roomId] {
		err := websocket.Message.Send(socket.Conn, content)
		if err != nil {
			return fmt.Errorf("error broadcasting message: ", err)
		}
	}
	return nil
}
