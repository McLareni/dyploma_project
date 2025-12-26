"use client";

import { useEffect, useRef, useState } from "react";
import ModeButton from "./ModeButton";
import { useSession } from "@/hooks/useSession";
import AddCollectionModal from "./AddCollectionModal";
import { useRouter } from "next/navigation";
import LanguageSwitch from "./LangSwitcher";
import AddWordModal from "./AddWordModal";
import { useTextSelection } from "@/hooks/useTextSelection";
import MessageItem from "./MessageItem";
import ChatInput from "./ChatInput";
import { GenerateAIMessage } from "@/hooks/useAIGenerate";
import { GeneratedWord } from "@/type/word";

export type ChatMode = "collection" | "story" | "translate";

interface TranslateWord {
  word: string;
  translation: string;
  alternatives?: string[];
}

export interface Message {
  role: "user" | "ai";
  content: string;
  mode?: ChatMode;
  collectionData?: GeneratedWord[];
  translateWord?: TranslateWord;
}

export default function Chat() {
  const [mode, setMode] = useState<ChatMode>("collection");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hi! I can help you generate a word collection, create a reading story, or translate text.",
    },
  ]);
  const [addCollectionModalOpen, setAddCollectionModalOpen] = useState(false);
  const [currentWords, setCurrentWords] = useState<GeneratedWord[]>([]);
  const [addWordModalOpen, setAddWordModalOpen] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState<TranslateWord>();
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("pl");

  const [loading, setLoading] = useState(false);
  const { user } = useSession();
  const router = useRouter();
  useTextSelection((text) => setInput(text), mode === "translate");
  const { generate } = GenerateAIMessage(user?.userId, fromLang, toLang);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    const aiMessage = await generate(mode, input);
    setMessages((prev) => [...prev, { role: "ai", mode, ...aiMessage }]);
    setLoading(false);
  };

  const handleAddCollection = (words: GeneratedWord[]) => {
    setCurrentWords(words);
    setAddCollectionModalOpen(true);
  };

  const handleAddWord = (translation?: TranslateWord) => {
    if (translation) {
      setCurrentTranslation(translation);
      setAddWordModalOpen(true);
    }
  };

  const handleSubmitCollection = async (name: string) => {
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.userId,
        words: currentWords,
        collection: { name, authorName: "EnglishAgent" },
      }),
    });
    router.push("/collections");
  };

  const handleSubmitWord = async (translation: string, word: string) => {
    const res = await fetch("/api/word", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.userId,
        word: { word, translation },
      }),
    });

    if (!res.ok) {
      return console.log("error");
    }

    const { wordId } = await res.json();

    await fetch("/api/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wordId,
      }),
    });
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInput("");
  }, [mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      {addCollectionModalOpen && (
        <AddCollectionModal
          isOpen={addCollectionModalOpen}
          onClose={() => setAddCollectionModalOpen(false)}
          onSubmit={handleSubmitCollection}
        />
      )}
      {addWordModalOpen && (
        <AddWordModal
          isOpen={addWordModalOpen}
          onClose={() => setAddWordModalOpen(false)}
          onSubmit={handleSubmitWord}
          defaultWord={currentTranslation}
        />
      )}

      <div className="flex gap-2 p-3 bg-gray-50 border-b">
        <ModeButton
          active={mode === "collection"}
          onClick={() => setMode("collection")}
        >
          📚 Collection
        </ModeButton>
        <ModeButton active={mode === "story"} onClick={() => setMode("story")}>
          📖 Story
        </ModeButton>
        <ModeButton
          active={mode === "translate"}
          onClick={() => setMode("translate")}
        >
          🌍 Translate
        </ModeButton>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="min-h-full flex flex-col justify-end gap-4">
          {messages.map((msg, i) => (
            <MessageItem
              key={i}
              msg={msg}
              onAddCollection={handleAddCollection}
              onAddWord={handleAddWord}
            />
          ))}
        </div>

        {loading && (
          <div className="text-sm text-gray-400">AI is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {mode === "translate" && (
        <LanguageSwitch setFromLang={setFromLang} setToLang={setToLang} />
      )}

      <ChatInput
        value={input}
        placeholder={
          mode === "collection"
            ? "Topic or language level (e.g. A2 travel words)"
            : mode === "story"
            ? "Story topic (e.g. learning English)"
            : "Text to translate"
        }
        loading={loading}
        onSubmit={handleGenerate}
        onChange={(e) => setInput(e.target.value)}
      />
    </main>
  );
}
