import Link from "next/link";
import HeaderLink from "./HeaderLink";

export default function Header() {
  return (
    <header className="py-4 px-10 bg-white shadow-md flex justify-between  items-center">
      <Link href="/" className="text-gray-700 text-2xl font-bold">
        EasyLanguage
      </Link>

      <ul className="flex flex-row gap-12">
        <HeaderLink href="/" text="Home" />
        <HeaderLink href="/profile" text="Profile" />
        <HeaderLink href="/collections" text="Collections" />
        <HeaderLink href="/agent" text="LanguageAgent" />
      </ul>
    </header>
  );
}
