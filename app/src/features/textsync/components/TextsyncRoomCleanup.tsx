"use client";

import { useEffect } from "react";

import { useTextsyncContext } from "../contexts/TextsyncContext";
import { service } from "../services/service";

export default function TextsyncRoomCleanup() {
  const { room, roomStatus } = useTextsyncContext();

  const handleCleanup = () => {
    if (roomStatus === "created") {
      service.deleteData(room.id);
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleCleanup);
    return () => {
      window.removeEventListener("beforeunload", handleCleanup);
    };
  });

  return <></>;
}
