import Link from "next/link";

export default function MainBtn() {
  return (
    <Link
      href="/"
      className="bg-linear-to-b from-blue-500 to-blue-700
         hover:from-blue-800 hover:to-blue-700
         transition-colors duration-700 text-white text-2xl font-bold py-2 px-4 rounded-full w-56 aspect-square flex items-center justify-center"
    >
      Start learning
    </Link>
  );
}
