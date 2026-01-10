import WordCard from "./WordCard";

type WordCardType = {
  id: number;
  word: string;
  translation: string;
  stage: number;
  lastStudy: string;
  nextReview: string;
  canStudy: boolean;
};

interface WordsListProps {
  words: WordCardType[];
  loading: boolean;
  error: string | null;
  query: string;
  deletingWordId: number | null;
  onRetry: () => void;
  onRemove: (wordId: number) => void;
}

export default function WordsList({
  words,
  loading,
  error,
  query,
  deletingWordId,
  onRetry,
  onRemove,
}: WordsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-500">
        <div className="text-sm">Loading words...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500">
        <div className="text-sm text-rose-600">{error}</div>
        <button
          onClick={onRetry}
          className="rounded-md bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-500">
        <div className="text-sm">
          {query ? "No words match your search" : "No words yet. Add your first word!"}
        </div>
      </div>
    );
  }

  return (
    <>
      {words.map((word) => (
        <WordCard
          key={word.id}
          id={word.id}
          word={word.word}
          translation={word.translation}
          stage={word.stage}
          lastStudy={word.lastStudy}
          nextReview={word.nextReview}
          canStudy={word.canStudy}
          onRemove={() => onRemove(word.id)}
          isDeleting={deletingWordId === word.id}
        />
      ))}
    </>
  );
}
