"use client";

import { ChangeEvent, useEffect, useState } from "react";

import TextsyncErrorMessage from "./TextsyncErrorMessage";
import { useTextsyncContext } from "../contexts/TextsyncContext";
import { service } from "../services/service";

export default function TextsyncRoomContent() {
  const { room } = useTextsyncContext();

  return (
    <div className="my-4">
      {room.id && (
        <>
          <div className="text-center my-4">current room: {room.id}</div>
          <TextsyncRoomTextArea roomId={room.id} />
        </>
      )}
    </div>
  );
}

function TextsyncRoomTextArea({ roomId }: { roomId: string }) {
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await service.getData(roomId, setContent);
      } catch (error) {
        setErrorMsg((error as Error).message);
      }
    };
    fetchData();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = service.unsubscribeData(roomId, setContent);
    return () => unsubscribe();
  }, [roomId]);

  const maxLength = 500;
  const placeholder = "Type here ...";

  const handleOnChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    try {
      await service.updateData(roomId, e.target.value);
    } catch (error) {
      setErrorMsg((error as Error).message);
    }
  };

  return (
    <div className="m-4">
      {errorMsg !== "" && (
        <TextsyncErrorMessage
          message={errorMsg}
          onDismiss={() => {
            setErrorMsg("");
          }}
        />
      )}
      <textarea
        value={content}
        onChange={handleOnChange}
        placeholder={placeholder}
        rows={4}
        maxLength={maxLength}
        className="w-full px-3 py-2 text-gray-700 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-colors duration-300 resize-none"
      ></textarea>
      <div className="mt-1 text-right text-sm text-gray-500">
        {content.length}/{maxLength}
      </div>
    </div>
  );
}
