interface WordsFilterProps {
  query: string;
  onQueryChange: (query: string) => void;
  onAddClick: () => void;
}

export default function WordsFilter({
  query,
  onQueryChange,
  onAddClick,
}: WordsFilterProps) {
  return (
    <div className="flex flex-1 w-full items-center gap-2 text-[11px] font-normal normal-case text-slate-600 sm:w-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Filter by word or translation"
        className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <button
        type="button"
        onClick={onAddClick}
        className="rounded-md bg-blue-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
      >
        Add word
      </button>
    </div>
  );
}
