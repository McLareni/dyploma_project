interface IProps {
  value: string;
  placeholder: string;
  loading: boolean;
  onChange: (e: any) => void;
  onSubmit: () => void;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  loading,
}: IProps) {
  return (
    <div className="border-t p-3 flex gap-2">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? "Loading..." : "Generate"}
      </button>
    </div>
  );
}
