import { Collection } from "@/type/collection";
import ProgressLine from "./ProgressLine";
import Link from "next/link";

interface IProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: IProps) {
  const progress = collection.users?.[0]?.progress ?? 0;
  const isCompleted = progress >= collection.length;

  return (
    <Link
      href={
        isCompleted ? "#" : `/collections/${collection.id}?progress=${progress}`
      }
      key={collection.id}
      className={`bg-white rounded p-4 relative overflow-hidden w-64 h-40 flex flex-col justify-between shadow-md transition-shadow ${
        !isCompleted ? "hover:shadow-lg" : "pointer-events-none opacity-70"
      }`}
    >
      {isCompleted && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      <div>
        <h3 className="text-xl">{collection.name}</h3>
        <p>Author: {collection.authorName}</p>
      </div>
      <div>
        {progress}/{collection.length}
        <ProgressLine progress={progress || 0} total={collection.length} />
      </div>
    </Link>
  );
}
