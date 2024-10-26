import { Service } from "./service";
import { Message } from "../types/message";

import { WEBSOCKET } from "@/config/websocketConfig";

const addData = async (roomId: string) => {
  const message = {
    roomId: roomId,
    command: "add",
  } as Message;

  await WEBSOCKET.send(JSON.stringify(message));
};

const getData = async (roomId: string) => {
  const message = {
    roomId: roomId,
    command: "get",
  } as Message;

  if (roomId !== "") {
    await WEBSOCKET.send(JSON.stringify(message));
  } else {
    throw new Error(`room ${roomId} doesn't seem to exist...`);
  }
};

const updateData = async (roomId: string, content: string) => {
  const message = {
    roomId: roomId,
    command: "update",
    content: content,
  } as Message;

  await WEBSOCKET.send(JSON.stringify(message));
};

const unsubscribeData = (
  roomId: string,
  setContent: (content: string) => void
) => {
  return WEBSOCKET.unsubscribe(roomId, setContent);
};

const deleteData = async (roomId: string) => {
  const message = {
    roomId: roomId,
    command: "delete",
  } as Message;

  await WEBSOCKET.send(JSON.stringify(message));
};

export const websocketService: Service = {
  addData: addData,
  getData: getData,
  updateData: updateData,
  unsubscribeData: unsubscribeData,
  deleteData: deleteData,
};
