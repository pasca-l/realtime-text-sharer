package domain

import "fmt"

type Room struct {
	Id      string
	Content string
}

type RoomManager struct {
	Rooms map[string]Room
}

func NewRoomManager() RoomManager {
	return RoomManager{
		Rooms: make(map[string]Room),
	}
}

func (rm *RoomManager) AddRoom(roomId string) error {
	if _, exists := rm.Rooms[roomId]; !exists {
		rm.Rooms[roomId] = Room{
			Id:      roomId,
			Content: "",
		}
		return nil
	}
	return fmt.Errorf("room id %s already exists", roomId)
}

func (rm *RoomManager) DeleteRoom(roomId string) error {
	if _, exists := rm.Rooms[roomId]; exists {
		delete(rm.Rooms, roomId)
		return nil
	}
	return fmt.Errorf("room id %s does not exist", roomId)
}

func (rm *RoomManager) GetContentFromRoom(roomId string) (string, error) {
	if room, exists := rm.Rooms[roomId]; exists {
		return room.Content, nil
	}
	return "", fmt.Errorf("room id %s does not exist", roomId)
}

func (rm *RoomManager) UpdateContentAtRoom(roomId string, content string) (string, error) {
	if room, exists := rm.Rooms[roomId]; exists {
		room.Content = content
		rm.Rooms[roomId] = room
		return room.Content, nil
	}
	return "", fmt.Errorf("room id %s does not exist", roomId)
}
