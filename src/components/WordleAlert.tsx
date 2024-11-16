interface WordleAlertProps {
  message: string;
}

function WordleAlert({ message }: WordleAlertProps) {
  return (
    <div
      className={`${
        message === "Congratulations! You've guessed the word!"
          ? "bg-lime-600 text-white"
          : "bg-yellow-400 text-black"
      } flex justify-center w-11/12 mx-auto mb-2 p-4 rounded-b-md shadow-md sm:w-2/3 border border-x-black border-b-black`}
      role="alert"
    >
      {message}
    </div>
  );
}

export default WordleAlert;
