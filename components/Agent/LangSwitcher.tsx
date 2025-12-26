import { useState } from "react";

interface IProps {
  setFromLang: (lang: string) => void;
  setToLang: (lang: string) => void;
}

export default function LanguageSwitch({ setFromLang, setToLang }: IProps) {
  const [fromLang, setLocalFromLang] = useState("en");
  const [toLang, setLocalToLang] = useState("pl");

  const handleSwap = () => {
    setLocalFromLang(toLang);
    setLocalToLang(fromLang);
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalFromLang(e.target.value);
    setFromLang(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalToLang(e.target.value);
    setToLang(e.target.value);
  };

  return (
    <div className="mx-3 mb-2 px-3 py-2 rounded-lg border bg-gray-50 flex items-center gap-2 text-sm">
      <select
        value={fromLang}
        onChange={handleFromChange}
        className="bg-white border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">EN</option>
        <option value="pl">PL</option>
        <option value="ua">UA</option>
      </select>

      <span className="text-gray-400">→</span>

      <select
        value={toLang}
        onChange={handleToChange}
        className="bg-white border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="pl">PL</option>
        <option value="ua">UA</option>
        <option value="en">EN</option>
      </select>

      <button
        type="button"
        onClick={handleSwap}
        className="ml-auto px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition"
      >
        ⇄ Swap
      </button>
    </div>
  );
}
