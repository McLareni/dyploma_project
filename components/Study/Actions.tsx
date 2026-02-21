import { useEffect, useState } from "react";

interface IProps {
  flipCard: () => void;
  changeWord: (status: "success" | "false" | "added") => void;
  isStudy: boolean;
  onAddToStudy: () => Promise<"added" | "already-added" | "error">;
  wordKey: string;
}

export default function Actions({
  flipCard,
  changeWord,
  isStudy,
  onAddToStudy,
  wordKey,
}: IProps) {
  const [nextWord, setNextWord] = useState<boolean>(false);
  const [status, setStatus] = useState<"success" | "false" | "added">("false");

  useEffect(() => {
    setNextWord(false);
    setStatus("false");
  }, [wordKey]);

  const changeCard = (result: "success" | "false") => {
    setStatus(result);
    flipCard();
    setNextWord(true);
  };

  const nextWordFn = async () => {
    changeWord(status);
    setNextWord(false);
  };

  const handleAddToStudy = async () => {
    void onAddToStudy();
    setStatus("added");
    flipCard();
    setNextWord(true);
  };

  const handleIWasWrong = () => {
    setStatus("false");
    nextWordFn();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 lg:gap-36 text-base sm:text-lg lg:text-xl w-full max-w-md sm:max-w-none px-4">
      {nextWord ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            onClick={nextWordFn}
            className="bg-blue-500 text-white px-4 py-3 sm:py-2 rounded w-full sm:w-52 h-12"
          >
            Next word
          </button>
          {status === "success" && (
            <button
              onClick={handleIWasWrong}
              className="bg-amber-500 text-white rounded w-full sm:w-52 h-8 sm:h-12"
            >
              I was wrong
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => changeCard("success")}
              className="bg-green-500 text-white rounded w-full sm:w-52 h-8 sm:h-12"
            >
              I know
            </button>
            <button
              onClick={() => changeCard("false")}
              className="bg-red-500 text-white rounded w-full sm:w-52 h-8 sm:h-12"
            >
              Don't know
            </button>
          </div>
          {!isStudy && (
            <button
              onClick={handleAddToStudy}
              className="bg-blue-500 text-white rounded w-full sm:w-52 h-8 sm:h-12"
            >
              Add to my list
            </button>
          )}
        </div>
      )}
    </div>
  );
}
