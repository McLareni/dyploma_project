interface IProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export default function ModeButton({ active, children, onClick }: IProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm transition ${
        active
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );
}
