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
    <div className="relative">
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg text-sm whitespace-pre-line ${
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
          className="hover:bg-blue-600 rounded-xl px-4 py-2 font-bold text-gray-700 hover:text-white text-sm absolute top-2 right-2 -translate-x-full"
        >
          Add collection
        </button>
      )}
      {msg.role === "ai" && msg.mode === "translate" && (
        <button
          onClick={() => onAddWord(msg.translateWord)}
          className="hover:bg-blue-600 rounded-xl px-4 py-2 font-bold text-gray-700 hover:text-white text-sm absolute top-2 right-10 -translate-x-full"
        >
          Add word
        </button>
      )}
    </div>
  );
}
