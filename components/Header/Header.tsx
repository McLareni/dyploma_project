"use client";

import Link from "next/link";
import HeaderLink from "./HeaderLink";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="py-4 px-4 sm:px-6 md:px-10 bg-white shadow-md flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <Link href="/" className="text-gray-700 text-xl sm:text-2xl font-bold">
        EasyLanguage
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex flex-row gap-6 lg:gap-12">
        <HeaderLink href="/" text="Home" />
        <HeaderLink href="/profile" text="Profile" />
        <HeaderLink href="/collections" text="Collections" />
        <HeaderLink href="/agent" text="LanguageAgent" />
      </ul>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`w-6 h-0.5 bg-gray-700 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <ul className="flex flex-col p-4 gap-2">
            <HeaderLink href="/" text="Home" onClick={() => setIsMenuOpen(false)} />
            <HeaderLink href="/profile" text="Profile" onClick={() => setIsMenuOpen(false)} />
            <HeaderLink href="/collections" text="Collections" onClick={() => setIsMenuOpen(false)} />
            <HeaderLink href="/agent" text="LanguageAgent" onClick={() => setIsMenuOpen(false)} />
          </ul>
        </div>
      )}
    </header>
  );
}
