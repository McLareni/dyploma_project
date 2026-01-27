import { Message } from "./Chat";

interface TranslateWord {
  word: string;
  translation: string;
  alternatives?: string[];
}

interface GeneratedWord {
  word: string;
  translation: string;
}

interface IProps {
  msg: Message;
  onAddCollection: (words: GeneratedWord[]) => void;
  onAddWord: (translation?: TranslateWord) => void;
}

export default function MessageItem({
  msg,
  onAddCollection,
  onAddWord,
}: IProps) {
  return (
    <div className="relative flex flex-col gap-2">
      <div
        className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm whitespace-pre-line ${
          msg.role === "ai"
            ? "bg-gray-100 text-gray-700 self-start"
            : "bg-blue-500 text-white self-end ml-auto"
        }`}
      >
        {msg.content}
      </div>
      {msg.role === "ai" && msg.mode === "collection" && (
        <button
          onClick={() => onAddCollection(msg.collectionData || [])}
          className="self-start bg-blue-500 hover:bg-blue-600 rounded-lg px-3 py-1.5 font-semibold text-white text-xs sm:text-sm transition"
        >
          Add collection
        </button>
      )}
      {msg.role === "ai" && msg.mode === "translate" && (
        <button
          onClick={() => onAddWord(msg.translateWord)}
          className="self-start bg-blue-500 hover:bg-blue-600 rounded-lg px-3 py-1.5 font-semibold text-white text-xs sm:text-sm transition"
        >
          Add word
        </button>
      )}
    </div>
  );
}
