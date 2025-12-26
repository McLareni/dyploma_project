"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "../UI/Modal";

interface GeneratedWord {
  word: string;
  translation: string;
  alternatives?: string[];
}

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (translation: string, word: string) => void;
  defaultWord?: GeneratedWord;
}

export default function AddWordModal({
  isOpen,
  onClose,
  onSubmit,
  defaultWord = {
    word: "I love you",
    translation: "Kocham cię",
    alternatives: ["Lubię cię", "Jestem w tobie zakochany/zakochana"],
  },
}: AddWordModalProps) {
  const [word, setWord] = useState(defaultWord.word);
  const [translation, setTranslation] = useState(defaultWord.translation);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  console.log(defaultWord);

  const handleSubmit = () => {
    if (!word.trim() || !translation.trim()) return;

    onSubmit(translation, word);

    onClose();
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-700">Add New Word</h2>

        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Word</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col relative" ref={containerRef}>
          <label className="text-gray-600 mb-1">Translation</label>

          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Select or type translation"
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {dropdownOpen && (
            <ul className="absolute z-10 mt-20 w-full max-h-40 overflow-y-auto border rounded bg-white shadow-lg">
              {[
                defaultWord.translation,
                ...(defaultWord.alternatives || []),
              ].map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setTranslation(option);
                    setDropdownOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Add Word
          </button>
        </div>
      </div>
    </Modal>
  );
}
