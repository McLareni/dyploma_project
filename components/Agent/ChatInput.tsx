interface IProps {
  value: string;
  placeholder: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const MAX_LENGTH = 40;

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  loading,
}: IProps) {
  const isOverLimit = value.length > MAX_LENGTH;

  return (
    <div className="border-t p-2 sm:p-3 flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full border rounded px-2 sm:px-3 py-2 pr-24 sm:pr-32 text-xs sm:text-sm focus:outline-none focus:ring-2 ${
              isOverLimit
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />

          {isOverLimit && (
            <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-red-500 pointer-events-none">
              Max {MAX_LENGTH}
            </span>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || isOverLimit}
          className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
