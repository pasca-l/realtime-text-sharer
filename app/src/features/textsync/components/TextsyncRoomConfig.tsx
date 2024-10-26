"use client";

import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent } from "react";

import { useTextsyncContext } from "../contexts/TextsyncContext";
import { generateRoomId } from "../utils/room";

export default function TextsyncRoomConfig() {
  const { room, roomStatus, enterRoom, exitRoom } = useTextsyncContext();

  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState<CodeStatus>("empty");
  const [disableInput, setDisableInput] = useState(false);

  type CodeStatus = "empty" | "partial" | "full";

  const codeLength = 6;

  const handleOnChange = (code: string) => {
    setCode(code);
  };

  useEffect(() => {
    switch (code.length) {
      case 0:
        setCodeStatus("empty");
        return;
      case codeLength:
        setCodeStatus("full");
        return;
      default:
        setCodeStatus("partial");
        return;
    }
  }, [code]);

  return (
    <div className="m-4">
      <TextsyncRoomInput disable={disableInput} onChange={handleOnChange} />
      <div className="flex justify-center space-x-4 my-4">
        <TextsyncRoomButton
          allowed={codeStatus === "empty" && roomStatus === "idle"}
          onClick={() => {
            enterRoom({ id: generateRoomId() }, "created");
            setDisableInput(true);
          }}
        >
          create room
        </TextsyncRoomButton>
        <TextsyncRoomButton
          allowed={codeStatus === "full" && roomStatus === "idle"}
          onClick={() => {
            enterRoom({ id: code }, "joined");
            setDisableInput(true);
          }}
        >
          join room
        </TextsyncRoomButton>
        <TextsyncRoomButton
          color="red"
          allowed={room.id !== undefined}
          onClick={() => {
            exitRoom(room);
            setDisableInput(false);
          }}
        >
          exit room
        </TextsyncRoomButton>
      </div>
    </div>
  );
}

function TextsyncRoomInput({
  length = 6,
  disable,
  onChange,
}: {
  length?: number;
  disable: boolean;
  onChange: (code: string) => void;
}) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string): void => {
    // sanitize by replacing unexpected characters to empty string
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (sanitizedValue === "") return;

    const newCode = [...code];
    newCode[index] = sanitizedValue;
    setCode(newCode);

    if (value !== "" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // give the concatenated code to onChange
    onChange(newCode.join(""));
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];

      // if current input is not empty, clear it
      // else if current input is empty, move to previous input and clear it
      if (newCode[index] !== "") {
        newCode[index] = "";
      } else if (index > 0) {
        newCode[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      }

      setCode(newCode);

      // give the concatenated code to onChange
      onChange(newCode.join(""));
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {code.map((char, index) => (
        <input
          key={index}
          disabled={disable}
          type="text"
          maxLength={1}
          value={char}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(index, e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(index, e)
          }
          ref={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          }}
          autoCapitalize="characters"
          className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none uppercase"
        />
      ))}
    </div>
  );
}

function TextsyncRoomButton({
  children,
  color = "blue",
  allowed,
  onClick,
}: {
  children: React.ReactNode;
  color?: string;
  allowed: boolean;
  onClick: () => void;
}) {
  type Color = "blue" | "red";
  const sanitizedColor = color as Color;

  const colorVariants: { [key in Color]: string } = {
    blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300",
    red: "bg-red-500 hover:bg-red-600 focus:ring-red-300",
  };
  const buttonStyle = `
    px-4 py-2 text-white
    rounded-md transition-colors duration-300 focus:outline-none
    ${
      allowed
        ? `${colorVariants[sanitizedColor]} focus:ring-2`
        : "bg-gray-400 cursor-not-allowed"
    }
  `;

  return (
    <button disabled={!allowed} onClick={onClick} className={buttonStyle}>
      {children}
    </button>
  );
}
