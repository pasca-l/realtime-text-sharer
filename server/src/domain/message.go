package domain

type Message struct {
	RoomId  string `json:"roomId"`
	Command string `json:"command"`
	Content string `json:"content"`
}
