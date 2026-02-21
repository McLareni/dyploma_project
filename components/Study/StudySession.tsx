"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Study from "./Study";
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
    })),
  );

  const [currentProgress, setCurrentProgress] = useState<number>(progress);

  const studyWordsRef = useRef(studyWords);

  const syncProgress = async (nextProgress?: number) => {
    if (isStudy || !collectionId) return;

    const progressValue =
      nextProgress ??
      studyWordsRef.current.filter((word) => word.correct).length;

    try {
      await fetch(`/api/collections/${collectionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress: progressValue }),
      });
    } catch (error) {
      console.error("Failed to sync progress", error);
    }
  };

  useEffect(() => {
    studyWordsRef.current = studyWords;
  }, [studyWords]);

  const getNextProgressIndex = (
    updatedWords: typeof studyWords,
    currentIndex: number,
  ) => {
    const nextIndex = updatedWords.findIndex(
      (word, index) => !word.correct && index > currentIndex,
    );

    if (nextIndex !== -1) return nextIndex;

    const firstIndex = updatedWords.findIndex((word) => !word.correct);
    return firstIndex !== -1 ? firstIndex : 0;
  };

  const addWordToStudyList = async (): Promise<
    "added" | "already-added" | "error"
  > => {
    const loadingToastId = toast.loading("Adding word...");

    try {
      const res = await fetch(`/api/study`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordId: studyWords[currentProgress].id,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast.dismiss(loadingToastId);
        toast.success("Word added");
        return "added";
      }

      if (res.status === 409) {
        toast.dismiss(loadingToastId);
        toast.info("Word already added");
        return "already-added";
      }

      toast.dismiss(loadingToastId);
      toast.error(
        data?.message && typeof data.message === "string"
          ? data.message
          : "Failed to add word",
      );
      console.error(data);
      return "error";
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Network error. Please try again");
      console.error(error);
      return "error";
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

  const changeWordStep = (
    word: string,
    status: "success" | "false" | "added",
  ) => {
    const currentWords = studyWordsRef.current;
    const currIndex = currentWords.findIndex((w) => w.word === word);
    const currWord = currentWords[currIndex];

    if (isStudy && status === "success") {
      changeWordStage(
        currWord.id,
        currWord.falseSteps <= 3 ? "success" : "false",
      );
    }
    if (!isStudy && status === "false") {
      void addWordToStudyList();
    }

    const updatedWords = currentWords.map((item, i) =>
      i === currIndex
        ? {
            ...item,
            correct:
              status === "success" ||
              status === "added" ||
              (status === "false" && !isStudy),
            falseSteps: status === "false" ? item.falseSteps + 1 : item.falseSteps,
          }
        : item,
    );

    changeStudyWords(updatedWords);

    const nextProgressIndex = getNextProgressIndex(updatedWords, currIndex);
    setCurrentProgress(nextProgressIndex);

    if (!isStudy) {
      const updatedProgress = updatedWords.filter((item) => item.correct).length;
      void syncProgress(updatedProgress);
    }
  };

  const addCurrentWordToStudy = async (): Promise<
    "added" | "already-added" | "error"
  > => {
    return addWordToStudyList();
  };

  if (studyWords.filter((word) => !word.correct).length === 0) {
    return <StudyModal isStudy={!!isStudy} />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 justify-start items-center h-full">
      {isStudy && (
        <StudyCounter
          currIndex={studyWords.filter((word) => word.correct).length}
          maxIndex={studyWords.length}
        />
      )}
      <Study
        word={studyWords[currentProgress]}
        nextWord={changeWordStep}
        isStudy={!!isStudy}
        onAddToStudy={addCurrentWordToStudy}
      />
    </div>
  );
}
