import { useState } from "react";

interface IProps {
  flipCard: () => void;
  changeWord: (status: "success" | "false") => void;
}

export default function Actions({ flipCard, changeWord }: IProps) {
  const [nextWord, setNextWord] = useState<boolean>(false);
  const [status, setStatus] = useState<"success" | "false">("false");
  const changeCard = (result: "success" | "false") => {
    setStatus(result);
    flipCard();
    setNextWord(true);
  };

  const nextWordFn = () => {
    changeWord(status);
    setNextWord(false);
  };

  return (
    <div className="flex flex-row justify-between gap-36 text-xl">
      {nextWord ? (
        <button
          onClick={nextWordFn}
          className="bg-blue-500 text-white px-4 py-2 rounded w-52 h-12"
        >
          Next word
        </button>
      ) : (
        <>
          <button
            onClick={() => changeCard("success")}
            className="bg-green-500 text-white px-4 py-2 rounded w-52 h-12"
          >
            I know
          </button>
          <button
            onClick={() => changeCard("false")}
            className="bg-red-500 text-white px-4 py-2 rounded w-52 h-12"
          >
            Don't know
          </button>
        </>
      )}
    </div>
  );
}
