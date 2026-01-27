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
    <div className="px-2 sm:px-3 py-2 border-t flex flex-wrap items-center gap-2 text-xs sm:text-sm bg-white">
      <div className="relative">
        <select
          value={fromLang}
          onChange={handleFromChange}
          className="
        appearance-none
        bg-white
        border border-gray-700
        text-gray-700
        rounded-md
        pl-2 sm:pl-3 pr-7 sm:pr-8 py-1.5
        text-xs sm:text-sm
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
        cursor-pointer
      "
        >
          <option value="en">EN</option>
          <option value="pl">PL</option>
          <option value="ua">UA</option>
        </select>

        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 text-xs">
          ▾
        </span>
      </div>

      <span className="text-gray-700 select-none text-xs sm:text-sm">→</span>

      <div className="relative">
        <select
          value={toLang}
          onChange={handleToChange}
          className="
        appearance-none
        bg-white
        border border-gray-700
        text-gray-700
        rounded-md
        pl-2 sm:pl-3 pr-7 sm:pr-8 py-1.5
        text-xs sm:text-sm
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
        cursor-pointer
      "
        >
          <option value="pl">PL</option>
          <option value="ua">UA</option>
          <option value="en">EN</option>
        </select>

        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 text-xs">
          ▾
        </span>
      </div>

      <button
        type="button"
        onClick={handleSwap}
        className="ml-auto border border-gray-700 text-gray-700 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm hover:bg-gray-700 hover:text-white transition"
      >
        ⇄ Swap
      </button>
    </div>
  );
}
