"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IProps {
  href: string;
  text: string;
  onClick?: () => void;
}

export default function HeaderLink({ href, text, onClick }: IProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`${
          isActive ? "text-blue-500" : "text-gray-700"
        } hover:text-blue-500 text-base md:text-xl font-medium block py-2 md:py-0`}
      >
        {text}
      </Link>
    </li>
  );
}
