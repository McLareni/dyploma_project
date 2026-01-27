"use client";

import MainBtn from "@/components/HomePage/MainBtn";
import WordsShowcase from "@/components/HomePage/WordsShowcase";
import { useState } from "react";

export default function Home() {
  const [isWordsOpen, setIsWordsOpen] = useState(false);

  return (
    <main className="relative flex min-h-[calc(100%-66px)] max-h-[calc(100%-66px)] items-center justify-center px-4 sm:px-5 py-8 sm:py-16">
      <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-10">
        <div className="hidden lg:block absolute left-4 top-6 h-full">
          <WordsShowcase />
        </div>

        {/* Mobile floating button */}
        {!isWordsOpen && (
          <button
            onClick={() => setIsWordsOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all active:scale-95"
            aria-label="Show vocabulary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        )}

        {/* Mobile fullscreen overlay */}
        {isWordsOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-gray-200 flex flex-col">
            <div className="bg-white shadow-md p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Vocabulary</h2>
              <button
                onClick={() => setIsWordsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Close vocabulary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <WordsShowcase />
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3 sm:gap-5 text-center max-w-full sm:max-w-xl lg:max-w-3xl px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Welcome to EasyLanguage
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-700">
            Your personal study app to easily learn new words and improve your
            language skills.
          </p>
          <MainBtn />
        </div>
      </div>
    </main>
  );
}
