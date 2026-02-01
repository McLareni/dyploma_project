"use client";

import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logOut } from "@/app/actions/auth";

type User = {
  email: string;
  username: string;
  learnedWords: number;
  createdAt: string;
};

const levels = [
  { name: "Beginner", maxWords: 30 },
  { name: "Intermediate", maxWords: 100 },
  { name: "Advanced", maxWords: 200 },
  { name: "Expert", maxWords: 500 },
  { name: "Master", maxWords: Infinity },
];

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.loading) return;
    setLoadingSession(false);

    if (!session.user) {
      router.push("/auth/login");
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`/api/profile/${session.user.userId}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser({
          email: data.email,
          username: data.username,
          learnedWords: data.quantityWords ?? 0,
          createdAt: data.createdAt ?? "",
        });
      } catch {
        router.push("/auth/login");
      }
    }

    fetchUser();
  }, [session.loading, session.user?.userId, router]);

  if (loadingSession || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  const currentLevelIndex = levels.findIndex(
    (level) => user.learnedWords < level.maxWords
  );
  const currentLevel = levels[currentLevelIndex];
  const prevLevelMax =
    currentLevelIndex === 0 ? 0 : levels[currentLevelIndex - 1].maxWords;
  const nextLevelMax = currentLevel.maxWords;
  const progressPercent = Math.min(
    Math.round(
      ((user.learnedWords - prevLevelMax) / (nextLevelMax - prevLevelMax)) * 100
    ),
    100
  );

  const handleLogout = () => {
    logOut()
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-dvh bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-blue-500 rounded-xl shadow-lg w-full max-w-[420px] p-6 flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-blue-600 text-center">Profile</h1>

        <div className="flex flex-col gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{user.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registered</label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{formatDate(user.createdAt)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level: {currentLevel.name}</label>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div className="bg-blue-500 h-4 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-sm text-gray-700 mt-1">{user.learnedWords} words — {progressPercent}% to next level</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={handleLogout}
            className="w-full bg-blue-500 text-white py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
