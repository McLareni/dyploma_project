"use client";

import { useState } from "react";
import Modal from "../UI/Modal";
import Link from "next/link";

interface IProps {
  isStudy: boolean;
}

export default function StudyModal({ isStudy }: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex flex-col items-center gap-6 sm:gap-8 text-center px-4 sm:px-8 py-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
            {isStudy ? "Lesson Completed!" : "Collection Completed!"}
          </h1>
          <p className="text-sm sm:text-base text-gray-700">
            {isStudy
              ? "You've finished today's lesson. Come back tomorrow for new words."
              : "You've gone through all the words in this collection. You can start reviewing them or begin a new collection."}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-2 w-full sm:w-auto">
          {isStudy ? (
            <Link
              href={"/"}
              className="bg-blue-700 text-white px-6 py-2.5 sm:py-2 rounded text-sm sm:text-base hover:bg-blue-600 transition"
            >
              Close
            </Link>
          ) : (
            <>
              <a
                href="/study"
                className="bg-blue-500 text-white px-6 py-2.5 sm:py-2 rounded text-sm sm:text-base hover:bg-blue-600 transition"
              >
                Start Learning Words
              </a>
              <a
                href={"/collections"}
                className="bg-gray-700 text-white px-6 py-2.5 sm:py-2 rounded text-sm sm:text-base hover:bg-gray-800 transition"
              >
                Close
              </a>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
