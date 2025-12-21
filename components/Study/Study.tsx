"use client";
import { Word } from "@/type/word";

import Actions from "./Actions";
import clsx from "clsx";
import { useState } from "react";

interface IProps {
  word: any;
  nextWord: (word: string, status: "success" | "false") => void;
}

export default function Study({ word: studyWord, nextWord }: IProps) {
  const [showBack, setShowBack] = useState<boolean>(false);

  const changeWord = (status: "success" | "false") => {
    setShowBack(false);
    nextWord(studyWord.word, status);
  };

  return (
    <div key={studyWord.word} className="flex flex-col items-center gap-12">
      <div className="outline-none perspective-midrange w-72 h-96">
        <div
          className={clsx(
            "relative size-full transition duration-1000 transform-3d  text-4xl text-center leading-96 text-gray-700",
            showBack && "transform-[rotateY(180deg)]"
          )}
        >
          <div className="absolute inset-0 size-full backface-hidden bg-white rounded">
            <h2 className="">{studyWord.word}</h2>
          </div>
          <div className="absolute inset-0 size-full backface-hidden transform-[rotateY(180deg)] bg-white  rounded">
            <h2 className="">{studyWord.translation}</h2>
          </div>
        </div>
      </div>
      <Actions
        flipCard={() => setShowBack((prev) => !prev)}
        changeWord={changeWord}
      />
    </div>
  );
}
