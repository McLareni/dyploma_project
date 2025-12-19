"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IProps {
  href: string;
  text: string;
}

export default function HeaderLink({ href, text }: IProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <li>
      <Link
        href={href}
        className={`${
          isActive ? "text-blue-500" : "text-gray-700"
        } hover:text-blue-500 text-xl font-medium`}
      >
        {text}
      </Link>
    </li>
  );
}
