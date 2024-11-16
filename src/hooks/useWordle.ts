import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Solution {
  value: string | undefined;
}
export interface Letter {
  value: string;
  color: string;
}
type Guess = Letter[];
export type History = Guess[];

type KeyboardRow = Letter[];
export type Keyboard = KeyboardRow[];

const useWordle = () => {
  const [activeAnswer, setActiveAnswer] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [history, setHistory] = useState<History>([]);
  const [isGameOver, setIsGameOver] = useState(false); // New state for game over

  const fetchSolution = () => {
    return axios
      .get(`http://localhost:8888/solutions/${Math.floor(Math.random() * 3)}`)
      .then((response) => {
        return response.data; // Axios automatically handles JSON response parsing
      });
    // .catch((error) => {
    //   return "An error occurred while fetching the random number.";
    // });
  };

  const { data: solution, error } = useQuery<Solution>({
    queryKey: ["solution"],
    queryFn: fetchSolution,
    retry: 0,
  });
  console.log(solution);
  // const solution = "awawa";

  const handleKeyUp = (event: KeyboardEvent): void => {
    const { key } = event;

    // Prevent input if the game is over
    if (isGameOver || history.length >= 6) return;

    if (key === "Backspace") {
      setActiveAnswer((prev) => prev.slice(0, -1));
      return;
    }

    if (/^[a-zA-Z]$/.test(key) && activeAnswer.length < 5) {
      setActiveAnswer((prev) => prev + key);
      setActiveLetter(key);

      setTimeout(() => {
        setActiveLetter(null);
      }, 200);
    }

    // Handle Enter: if the answer is valid and 5 letters long, add the guess
    if (key === "Enter" && activeAnswer.length === 5) {
      if (history.length < 6) {
        addGuess(activeAnswer);
      }
    }
  };

  const fromGuessToString = (guess: Guess): string => {
    return guess.map((letter) => letter.value).join("");
  };

  const guessAlreadyExists = history.some(
    (guess) => fromGuessToString(guess) === activeAnswer
  );

  const addGuess = (currentAnswer: string): void => {
    if (guessAlreadyExists) {
      return;
    }

    if (history.length >= 6) {
      // setIsGameOver(true);
      setActiveAnswer("");
      return;
    }

    const newGuess = makeAGuess(currentAnswer);

    // Check if the guess is correct to end the game
    if (fromGuessToString(newGuess) === solution?.value) {
      setIsGameOver(true); // End the game if the guess is correct
    }

    setHistory((prevHistory) => {
      return [...prevHistory, newGuess];
    });
    setActiveAnswer("");
  };

  const makeAGuess = (currentAnswer: string): Guess => {
    const guess: Guess = [];
    const tempSolution: (string | null)[] = solution?.value?.split("") || []; // Create a modifiable copy of the solution

    // First pass: Check for correct positions (green)
    currentAnswer.split("").forEach((char, i) => {
      if (char === tempSolution[i]) {
        guess.push({ value: char, color: "green" });
        tempSolution[i] = null; // Mark as used
      } else {
        guess.push({ value: char, color: "grey" });
      }
    });

    // Second pass: Check for misplaced letters (yellow)
    currentAnswer.split("").forEach((char, i) => {
      if (guess[i].color === "grey" && tempSolution.includes(char)) {
        guess[i].color = "yellow";
        tempSolution[tempSolution.indexOf(char)] = null; // Mark as used
      }
    });

    return guess;
  };

  // Function to derive the state of all letters based on the history
  let allLetters: Letter[] = Array.from({ length: 26 }, (_, i) => ({
    value: String.fromCharCode(97 + i), // 'a' to 'z'
    color: "white",
  }));

  history.forEach((guess) => {
    guess.forEach(({ value, color }) => {
      const letterIndex = allLetters.findIndex(
        (letter) => letter.value === value
      );

      if (letterIndex !== -1) {
        // Only update the color if the new color is "higher" priority
        const currentColor = allLetters[letterIndex].color;
        if (
          currentColor === "white" ||
          (currentColor === "gray" &&
            (color === "yellow" || color === "green")) ||
          (currentColor === "yellow" && color === "green")
        ) {
          allLetters[letterIndex].color = color;
        }
      }
    });
  });

  const deriveMessageFromHistory = (): string => {
    if (isGameOver) return "Congratulations! You've guessed the word!";
    if (history.length >= 6) return "Game Over!";
    if (history.some((guess) => fromGuessToString(guess) === activeAnswer))
      return "Guess already exists";
    return ""; // Default message
  };

  const createKeyboardLetters = (allLetters: Letter[]): Keyboard => {
    const qwertyLayout = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

    return qwertyLayout.map((row) =>
      row.split("").map((char) => {
        const foundLetter = allLetters.find((letter) => letter.value === char);
        return foundLetter ?? { value: char, color: "white" }; // Default to white if not found
      })
    );
  };

  const keyboardLetters = createKeyboardLetters(allLetters);
  const message = deriveMessageFromHistory();

  return {
    handleKeyUp,
    activeAnswer,
    history,
    message,
    allLetters,
    keyboardLetters,
    isGameOver,
    activeLetter,
    error,
  }; // Return isGameOver
};

export default useWordle;
