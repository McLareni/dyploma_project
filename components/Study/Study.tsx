"use client";

import Actions from "./Actions";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface IProps {
  word: any;
  nextWord: (word: string, status: "success" | "false" | "added") => void;
  isStudy: boolean;
  onAddToStudy: () => Promise<"added" | "already-added" | "error">;
}

export default function Study({
  word: studyWord,
  nextWord,
  isStudy,
  onAddToStudy,
}: IProps) {
  const [showBack, setShowBack] = useState<boolean>(false);

  useEffect(() => {
    setShowBack(false);
  }, [studyWord.word]);

  const changeWord = (status: "success" | "false" | "added") => {
    setShowBack(false);
    nextWord(studyWord.word, status);
  };

  return (
    <div key={studyWord.word} className="flex flex-col items-center gap-8 sm:gap-10 lg:gap-12 px-4 flex-1">
      <div className="outline-none perspective-midrange w-60 h-60 flex-1 lg:w-62 lg:h-80">
        <div
          className={clsx(
            "relative size-full transition duration-1000 transform-3d text-2xl sm:text-3xl lg:text-4xl text-center text-gray-700",
            showBack && "transform-[rotateY(180deg)]"
          )}
        >
          <div className="absolute inset-0 size-full backface-hidden bg-white rounded flex items-center justify-center p-4">
            <h2 className="">{studyWord.word}</h2>
          </div>
          <div className="absolute inset-0 size-full backface-hidden transform-[rotateY(180deg)] bg-white rounded flex items-center justify-center p-4">
            <h2 className="">{studyWord.translation}</h2>
          </div>
        </div>
      </div>
      <Actions
        flipCard={() => setShowBack((prev) => !prev)}
        changeWord={changeWord}
        isStudy={isStudy}
        onAddToStudy={onAddToStudy}
        wordKey={String(studyWord.id ?? studyWord.word)}
      />
    </div>
  );
}
