import CollectionCard from "@/components/Collections/CollectionCard/CollectionCard";
import { Collection } from "@/type/collection";

const URL = process.env.PUBLIC_HOST;

export default async function Collections() {
  const res = await fetch(URL + "/api/collections");
  const collections: Collection[] = await res.json();

  return (
    <div className="flex flex-row gap-8 p-8 justify-center">
      {collections &&
        collections.map((collection: any) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
    </div>
  );
}
