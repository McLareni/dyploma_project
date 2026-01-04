"use client";

import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";

type User = {
  email: string;
  username: string;
  learnedWords: number;
};

const levels = [
  { name: "Beginner", maxWords: 100 },
  { name: "Intermediate", maxWords: 500 },
  { name: "Advanced", maxWords: 1000 },
  { name: "Expert", maxWords: 2000 },
  { name: "Master", maxWords: Infinity },
];

export default function Profile() {
  const [user, setUser] = useState<User>({
    email: "",
    username: "",
    learnedWords: 0,
  });
  const session = useSession();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/profile/${session.user.userId}`);
      const data = await res.json();
      setUser({
        email: data.email,
        username: data.username,
        learnedWords: data.quantityWords ?? 0,
      });
    }

    fetchUser();
  }, []);

  const currentLevelIndex = levels.findIndex(
    (level) => user.learnedWords <= level.maxWords
  );
  const currentLevel = levels[currentLevelIndex];

  const prevLevelMax = currentLevelIndex === 0 ? 0 : levels[currentLevelIndex - 1].maxWords;
  const nextLevelMax = currentLevel.maxWords;

  const progressPercent = Math.min(
    Math.round(((user.learnedWords - prevLevelMax) / (nextLevelMax - prevLevelMax)) * 100),
    100
  );

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center p-10">
      <div className="bg-white border-2 border-blue-500 rounded-xl shadow-lg w-[420px] p-6 flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-blue-600 mb-4">Profile</h1>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {user.username}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {user.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level: {currentLevel.name}
            </label>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {user.learnedWords} words — {progressPercent}% to next level
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
