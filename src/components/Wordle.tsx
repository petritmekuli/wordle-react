import { useEffect } from "react";
import useWordle from "../hooks/useWordle";
import WordleTable from "./WordleTable";
import WordleKeyboard from "./WordleKeyboard";
import WordleAlert from "./WordleAlert";

function Wordle() {
  const {
    activeAnswer,
    activeLetter,
    handleKeyUp,
    history,
    message,
    keyboardLetters,
    error,
  } = useWordle();

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  return (
    <div className="App">
      {error ? (
        <h1>Oops! An error occurred.</h1>
      ) : (
        <>
          <WordleTable history={history} activeAnswer={activeAnswer} />

          {message && <WordleAlert message={message} />}

          <WordleKeyboard
            keyboardLetters={keyboardLetters}
            handleKeyUp={handleKeyUp}
            activeLetter={activeLetter}
          />
        </>
      )}
    </div>
  );
}

export default Wordle;
