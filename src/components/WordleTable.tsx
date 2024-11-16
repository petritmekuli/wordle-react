import { History } from "../hooks/useWordle";

interface WordleTableProps {
  history: History;
  activeAnswer: string;
}

const WordleTable = ({ history, activeAnswer }: WordleTableProps) => {
  const totalRows = 6;
  const totalCols = 5;

  return (
    <table className="min-w-60 w-11/12 sm:w-2/3 mx-auto mt-2 border-collapse border border-black">
      <tbody>
        {/* Render history rows */}
        {history.map((guess, rowIndex) => (
          <tr key={rowIndex}>
            {guess.map((letter, letterIndex) => (
              <td
                key={letter.value + letterIndex}
                className={`text-center p-4 border border-black ${
                  letter.color === "green"
                    ? "bg-lime-600 text-white"
                    : letter.color === "yellow"
                    ? "bg-yellow-400 text-black"
                    : letter.color === "grey"
                    ? "bg-gray-500 text-white"
                    : "bg-white-50 text-black"
                }`}
              >
                {letter.value.toUpperCase()}
              </td>
            ))}
          </tr>
        ))}

        {/* Active answer row */}
        {history.length < totalRows && (
          <tr>
            {Array.from({ length: totalCols }).map((_, colIndex) => (
              <td
                key={colIndex}
                className="text-center border border-black bg-blue-50"
                style={{ width: "50px", height: "50px" }}
              >
                {activeAnswer[colIndex]?.toUpperCase()}
              </td>
            ))}
          </tr>
        )}

        {/* Fill empty rows */}
        {Array.from({ length: totalRows - 1 - history.length }).map(
          (_, rowIndex) => (
            <tr key={history.length + rowIndex}>
              {Array.from({ length: totalCols }).map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="text-center border border-black bg-white"
                  style={{ width: "50px", height: "50px" }}
                />
              ))}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default WordleTable;
