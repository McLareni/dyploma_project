"use client";

import { useEffect, useRef, useState } from "react";
import Study from "./Study";
import { useSession } from "@/hooks/useSession";
import StudyCounter from "./StudyCounter";
import StudyModal from "./StudyModal";

interface IProps {
  words: any[];
  progress: number;
  isStudy?: boolean;
  collectionId?: number;
}

export default function StudySession({
  words,
  progress,
  isStudy,
  collectionId,
}: IProps) {
  const [studyWords, changeStudyWords] = useState(
    words.map((item, index) => ({
      falseSteps: 0,
      ...item,
      correct: index < progress,
    }))
  );

  const [currentProgress, setCurrentProgress] = useState<number>(progress);
  const { user } = useSession();

  const studyWordsRef = useRef(studyWords);

  useEffect(() => {
    studyWordsRef.current = studyWords;
  }, [studyWords]);

  const addWordToStudyList = async () => {
    const res = await fetch(`/api/study`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        wordId: studyWords[currentProgress].id,
      }),
    });

    if (!res.ok) {
      console.error(await res.json());
    }
  };

  const changeWordStage = async (id: string, status: "success" | "false") => {
    const res = await fetch(`/api/study/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wordId: id,
        status,
      }),
    });
  };

  const changeWordStep = (word: string, status: "success" | "false") => {
    const currIndex = studyWords.findIndex((w) => w.word === word);
    const currWord = studyWords[currIndex];

    if (isStudy && status === "success") {
      changeWordStage(
        currWord.id,
        currWord.falseSteps <= 3 ? "success" : "false"
      );
    }
    if (!isStudy && status === "false") {
      addWordToStudyList();
    }

    changeStudyWords((prev) =>
      prev.map((item, i) =>
        i === currIndex
          ? {
              ...item,
              correct: status === "success" || (status === "false" && !isStudy),
              falseSteps:
                status === "false" ? item.falseSteps + 1 : item.falseSteps,
            }
          : item
      )
    );

    setCurrentProgress((prev) => {
      const nextIndex = studyWords.findIndex(
        (w, i) => !w.correct && i > currIndex
      );
      if (nextIndex !== -1) return nextIndex;
      const firstIndex = studyWords.findIndex((w) => !w.correct);
      return firstIndex !== -1 ? firstIndex : 0;
    });
  };

  useEffect(() => {
    if (isStudy) return;
    const sendProgress = () => {
      const progress = studyWordsRef.current.filter((w) => w.correct).length;

      navigator.sendBeacon(
        `/api/collections/${collectionId}`,
        JSON.stringify({ progress })
      );
    };

    window.addEventListener("beforeunload", sendProgress);

    return () => {
      sendProgress();
      window.removeEventListener("beforeunload", sendProgress);
    };
  }, [collectionId]);

  if (studyWords.filter((word) => !word.correct).length === 0) {
    return <StudyModal isStudy={!!isStudy} />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 justify-center items-center h-full">
      {isStudy && (
        <StudyCounter
          currIndex={studyWords.filter((word) => word.correct).length}
          maxIndex={studyWords.length}
        />
      )}
      <Study word={studyWords[currentProgress]} nextWord={changeWordStep} />
      {!isStudy && (
        <button
          onClick={addWordToStudyList}
          className="bg-blue-500 text-white text-xl px-4 py-2 rounded w-52 h-12"
        >
          Add to my list
        </button>
      )}
    </div>
  );
}
