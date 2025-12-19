"use client";

import { Word } from "@/type/word";
import { useState } from "react";
import Study from "./Study";

interface IProps {
  words: any[];
  progress: number;
}

export default function StudySession({ words, progress }: IProps) {
  const [studyWords, changeStudyWords] = useState([
    ...words.map((item) => ({ falseSteps: 0, ...item.word })),
  ]);
  const [currentProgress, setCurrentProgress] = useState<number>(progress);

  return (
    <div className="flex flex-col gap-4 p-8 justify-center items-center">
      <Study word={studyWords[currentProgress]} />
    </div>
  );
}
