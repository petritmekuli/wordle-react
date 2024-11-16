import { useState } from "react";
import { Keyboard, Letter } from "../hooks/useWordle";

interface WordleKeyboardProps {
  keyboardLetters: Keyboard;
  handleKeyUp: (event: KeyboardEvent) => void;
  activeLetter: string | null;
}

function WordleKeyboard({
  keyboardLetters,
  handleKeyUp,
  activeLetter,
}: WordleKeyboardProps) {
  const handleClick = (letter: string) => {
    const event = new KeyboardEvent("keyup", { key: letter });
    handleKeyUp(event);
  };
  return (
    <div className="mt-8 keyboard sm:w-2/3 mx-auto">
      {keyboardLetters.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex justify-center
                           ${rowIndex === 2 ? " " : " "}
                          border border-black
        `}
        >
          {row.map((letter) => (
            <button
              onClick={() => handleClick(letter.value)}
              key={letter!.value}
              className={`border border-black w-1/12 m-0.5 p-1 md:m-1 md:p-4 rounded-md shadow-xl
                 ${
                   activeLetter === letter.value
                     ? "bg-blue-600 text-white" // Apply active class and remove existing color classes
                     : letter!.color === "green"
                     ? "bg-lime-600 text-white"
                     : letter!.color === "yellow"
                     ? "bg-yellow-400 text-black"
                     : letter!.color === "grey"
                     ? "bg-gray-500 text-white"
                     : "bg-white text-black"
                 }`}
            >
              {letter!.value.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default WordleKeyboard;
