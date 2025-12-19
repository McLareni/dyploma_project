import { Collection } from "@/type/collection";
import ProgressLine from "./ProgressLine";
import Link from "next/link";

interface IProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: IProps) {
  return (
    <Link
      href={`/collections/${collection.collection.id}?progress=${collection.progress}`}
      key={collection.id}
      className="bg-white rounded p-4 relative overflow-hidden w-64 h-40 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow"
    >
      <div>
        <h3 className="text-xl">{collection.collection.name}</h3>
        <p>Author: {collection.collection.authorName}</p>
      </div>
      <div>
        {collection.progress}/{collection.collection.length}
        <ProgressLine
          progress={collection.progress}
          total={collection.collection.length}
        />
      </div>
    </Link>
  );
}
