"use client";

import { useState } from "react";
import Study from "./Study";
import { useSession } from "@/hooks/useSession";

interface IProps {
  words: any[];
  progress: number;
}

export default function StudySession({ words, progress }: IProps) {
  const [studyWords, changeStudyWords] = useState([
    ...words.map((item) => ({ falseSteps: 0, ...item.word, correct: false })),
  ]);
  const [currentProgress, setCurrentProgress] = useState<number>(progress);
  const filteredWords = studyWords.filter((word) => !word.correct);
  const { user } = useSession();

  const addWordToStudyList = async () => {
    const res = await fetch(`/api/study`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        wordId: filteredWords[currentProgress].id,
      }),
    });

    if (!res.ok) {
      console.error(await res.json());
    }
  };

  const changeWordStep = (word: string, status: "success" | "false") => {
    changeStudyWords((prev) =>
      prev.map((item) =>
        item.word === word
          ? {
              ...item,
              correct: status === "success",
              falseSteps:
                status === "false" ? item.falseSteps + 1 : item.falseSteps,
            }
          : item
      )
    );

    setCurrentProgress((prev) => {
      let index = prev >= filteredWords.length - 1 ? 0 : prev + 1;
      index = index > 0 && status === "success" ? index - 1 : index;
      return index;
    });
  };

  if (filteredWords.length === 0) {
    console.log("add modal");
    return;
  }

  return (
    <div className="flex flex-col gap-16 p-8 justify-center items-center">
      <Study word={filteredWords[currentProgress]} nextWord={changeWordStep} />
      <button
        onClick={addWordToStudyList}
        className="bg-blue-500 text-white text-xl px-4 py-2 rounded w-52 h-12"
      >
        Add to my list
      </button>
    </div>
  );
}
