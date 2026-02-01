import { Word } from "@/type/word";
import { useEffect, useRef, useState, type MouseEvent } from "react";

type WordCardProps = Word & {
  stage: number;
  lastStudy: string;
  nextReview: string;
  canStudy: boolean;
  onRemove: () => void;
  isDeleting: boolean;
};

export default function WordCard({
  word,
  translation,
  canStudy,
  onRemove,
  isDeleting,
}: WordCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setShowRemove(false);
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(event.target as Node)) {
        setShowRemove(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMobile]);

  const handleCardClick = () => {
    if (!isMobile) return;
    setShowRemove((prev) => !prev);
  };

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <article
      ref={cardRef}
      onClick={handleCardClick}
      className="group h-20 relative flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50/80 p-2 shadow-[0_6px_18px_-14px_rgba(15,23,42,0.4)] transition duration-150 hover:border-slate-300 hover:bg-white hover:shadow-none"
    >
      <button
        type="button"
        onClick={handleRemoveClick}
        disabled={isDeleting}
        className={`absolute right-2 top-2 rounded-full bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 md:group-hover:inline-flex ${
          showRemove ? "inline-flex" : "hidden"
        }`}
      >
        {isDeleting ? "..." : "Remove"}
      </button>

      <div className="pr-2">
        <h3 className="text-sm font-semibold text-slate-900 leading-tight truncate">
          {word}
        </h3>
      </div>

      <p className="text-xs font-medium text-slate-800 line-clamp-2">
        {translation}
      </p>

      <div className="mt-1 flex items-center justify-end">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap ${
            !canStudy && "bg-slate-100 text-slate-600"
          }`}
        >
          {!canStudy && "Studied"}
        </span>
      </div>
    </article>
  );
}
