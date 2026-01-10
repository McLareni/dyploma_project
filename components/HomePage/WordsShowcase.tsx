"use client";

import { useEffect, useState } from "react";

import { Word } from "@/type/word";
import AddWordModal from "@/components/Agent/AddWordModal";
import { formatDate, formatNextReview } from "@/utils/formatDates";
import WordsFilter from "./WordsFilter";
import WordsList from "./WordsList";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useSession } from "@/hooks/useSession";

type WordCard = Word & {
  stage: number;
  lastStudy: string;
  nextReview: string;
  canStudy: boolean;
};
const PAGE_SIZE = 20;

export default function WordsShowcase() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [words, setWords] = useState<WordCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingWordId, setDeletingWordId] = useState<number | null>(null);
  const [confirmDeleteWordId, setConfirmDeleteWordId] = useState<number | null>(
    null
  );

  const { user } = useSession();

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => clearTimeout(handle);
  }, [query]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(PAGE_SIZE));
      if (debouncedQuery) {
        params.set("query", debouncedQuery);
      }

      const response = await fetch(`/api/word?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch words");
      }

      const data = await response.json();
      setFilteredTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      const now = new Date();
      const formattedWords = data.words.map((word: any) => {
        const nextReviewDate = new Date(word.nextReview);
        const canStudy = nextReviewDate <= now;

        return {
          id: word.id,
          word: word.word,
          translation: word.translation,
          stage: word.stage,
          lastStudy: formatDate(word.lastStudy),
          nextReview: formatNextReview(word.nextReview),
          canStudy,
        };
      });
      setWords(formattedWords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load words");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [page, debouncedQuery]);

  const fetchTotalWords = async () => {
    try {
      const response = await fetch("/api/word/total");

      if (!response.ok) {
        throw new Error("Failed to fetch total words");
      }

      const data = await response.json();
      const totalCount = data.total ?? 0;

      setTotal(totalCount);
    } catch (err) {
      console.error("Fetch total error:", err);
    }
  };

  useEffect(() => {
    fetchTotalWords();
  }, [debouncedQuery]);

  const deleteWord = async (wordId: number) => {
    try {
      setDeletingWordId(wordId);
      const response = await fetch("/api/word", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete word");
      }

      setWords((prevWords) => prevWords.filter((w) => w.id !== wordId));
      await fetchTotalWords();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete word");
    } finally {
      setDeletingWordId(null);
    }
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

    setIsModalOpen(false);
    fetchWords();
    fetchTotalWords();
  };

  return (
    <section className="max-w-85 w-85">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            All words
          </p>
          <h2 className="text-lg font-semibold text-slate-900">Vocabulary</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          <span className="uppercase tracking-wide text-slate-500">Words</span>
          <span className="text-base text-slate-900">
            {filteredTotal}/{total}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/85 shadow-[0_10px_26px_-20px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          <WordsFilter
            query={query}
            onQueryChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            onAddClick={() => setIsModalOpen(true)}
          />
        </div>

        <div className="h-[70vh] flex flex-col gap-2 overflow-y-auto px-3 py-3">
          <WordsList
            words={words}
            loading={loading}
            error={error}
            query={query}
            deletingWordId={deletingWordId}
            onRetry={fetchWords}
            onRemove={(wordId) => setConfirmDeleteWordId(wordId)}
          />
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          <span>
            Page {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddWordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(translation, word) => {
          handleSubmitWord(translation, word);
        }}
      />

      <DeleteConfirmationModal
        isOpen={confirmDeleteWordId !== null}
        wordName={words.find((w) => w.id === confirmDeleteWordId)?.word || ""}
        onCancel={() => setConfirmDeleteWordId(null)}
        onConfirm={() => {
          setConfirmDeleteWordId(null);
          deleteWord(confirmDeleteWordId!);
        }}
      />
    </section>
  );
}
